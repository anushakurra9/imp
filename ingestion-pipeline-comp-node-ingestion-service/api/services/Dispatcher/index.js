'use strict';

const Hawk = require('hawk')
const Q = require("q")
const Arrays = require("../../utils/Arrays")
const Notifier = require("../../thirdparty/NotificationAPI")
const BatchItemProvider = require("../BatchItemProvider")
const WORKERS = require("../Workers")

module.exports = {
    
    getNextDispatchForWorker: function(worker, skip_schedule, count) {
        var defer = Q.defer()

        let worker_config = WORKERS.list[worker]
        var query = worker_config && worker_config.enabled ? worker_config.dispatchQuery : null

        if (!query) {
            //early exit.
            defer.resolve([])
            return defer.promise
        }

        BatchItem.find(query)
        .limit(count)
        .exec(function(error, items) {
            if (items && items.length > 0) {
                if (skip_schedule) {
                    defer.resolve(items)
                    return
                }
                onItemsScheduled(items)
                .then(function(updated) {
                    defer.resolve(updated)
                })
                return 
            }
            else {
                defer.resolve([])
            }
        })

        

        return defer.promise
    },

    onProgressionFromWorker: function(worker, item, batch, attempts, result) {
        var defer = Q.defer()

        let newState = {
        }
        if (attempts && attempts.length > 0) {
            newState.attempts = item.attempts.concat(attempts)
            item.attempts = newState.attempts
        }

        let worker_config =  WORKERS.list[worker]
        let progression_config = worker_config ? worker_config.progression : null


        if (result && result.statusCode === 200) {
            newState.progression = item.progression
            let resultKey = worker_config.progression.resultKey
            newState.progression[resultKey] = result[resultKey]
        }


        newState.status = (result && result.statusCode === 200) ? progression_config.successStatus : progression_config.failedStatus
        if (["completed", "failed"].indexOf(newState.status) >= 0) {
            newState.completedAt = Date.now()
        }

        BatchItem.update({id: item.id}, newState)
        .exec(function(error, afterwards) {
            

            if (worker_config.progression.notificationEnabled) {
                var receipients = [batch.createdBy].concat(batch.collaborators ? batch.collaborators : [])
                var message = result.statusCode === 200 ? worker_config.progression.successMessage : worker_config.progression.errorMessage

                Notifier.sendIngestionNotification(batch, item, receipients, result.statusCode, message, null)
            }


            defer.resolve(afterwards)
        })

        return defer.promise
    },

    validateRequest: function(request, callback) {
        Hawk.server.authenticate(request, hawkCredentialsFunction, {}, function (err, credentials, artifacts) {
            callback(err, (!err && credentials) ? true : false, artifacts)
        });
    }
    
}


function hawkCredentialsFunction(hawkId, callback) {
    let dispatchConfig = sails.config.DispatchService

    var credentials = {
        key: (dispatchConfig.hawkId === hawkId) ? dispatchConfig.hawkSecret : "na",
        algorithm: "sha256"
    }
    callback(null, credentials)
}
  
function onItemsScheduled(items) {

    let ids = Arrays.getKeys(items, "id")
    var defer = Q.defer()
    BatchItem.update({id: {$in: ids}}
        , {status: "scheduled"})
        .exec(function afterwards(error, updated) {
            defer.resolve(updated)
        })
    return defer.promise
    
}
