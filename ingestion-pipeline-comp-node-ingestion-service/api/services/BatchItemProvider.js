'use strict';
const uuidV4 = require('uuid/v4')
const Q = require("q")
const Arrays = require("../utils/Arrays")
const BatchProvider = require("./BatchProvider")
const ItemWLManager = require("./ItemWaitingListManager")
const Validtor = require("../utils/Validator")

module.exports = {
    deleteBatchItems: function(batchId, callback) {
        BatchItem.destroy({batchId: batchId}).exec(function(err) {
            callback(err, err ? {} : {status: "deleted items for batch", batchId: batchId})}
        )
    },
    deleteItem: function(itemId, callback) {
        BatchItem.destroy({id: itemId}).exec(function(err) {
            callback(err, err ? {} : {status: "deleted item", itemId: itemId})}
        )
    },

    getAllItems: function(query, pIndex, count, callback) {
        var page = (isNaN(pIndex) || pIndex < 0) ? 0 : pIndex
        var size = (isNaN(count) || count < 0 || count > 100) ? 100 : count

        BatchItem.find(query ? query : {})
        .skip(pIndex * count)
        .limit(count)
        .then(function(list) {
            callback({
                page: {
                    pIndex: page, count: list ? list.length : 0
                },
                items: list ? list : []
            })
        })
    },
    
    
    getBatchItems: function(batchId, callback) {
        BatchItem.find({batchId: batchId})
        .then(callback)
    },
    addBatchItems: function(batchId, byPassValidation, items, callback) {

        if (!items || items.length === 0) {
            return callback(null, [])
        }

        BatchProvider.getBatchById(batchId)
        .then(function(batch) {
            if (!batch) {
                return callback({error: "batch does not exist"}, null)
            }

            if (!byPassValidation) {
                let validationResult = Validtor.validateNewInput(batch, items)
                if (validationResult.errors && validationResult.errors.length > 0) {
                    callback(validationResult.errors, null);
                    return
                }
            }

            BatchItem.create(items)
            .exec(function(error, created) {
                callback(error, created)
            })
        })
    },

    getItemByIds: function(ids) {
        var deferred = Q.defer()   
        BatchItem.find({id: {$in: ids}})
        .then(function(items) {
            deferred.resolve(items)
        })

        return deferred.promise
    },
    
    getItemById: function(itemId) {
        var deferred = Q.defer()   
        BatchItem.findOne({id: itemId})
        .then(function(existing) {
            deferred.resolve(existing)
        })

        return deferred.promise
    }, 
    
    submitItemsOfBatch(batchId, callback) {
        BatchItem.update({batchId: batchId, status: "draft"}, {status: "submitted", submittedAt: Date.now()})
        .exec(callback)
    },

    submitItems: function(itemIds, callback) {
        //item must be in draft, or failed state to be submitted
        if (!itemIds || itemIds.length == 0) {
            callback({reason: "item ids missing"}, null)
            return
        }
        
        BatchItem.update({id: {$in: itemIds}, status: {$in: ["draft", "failed"]}}
        , {status: "submitted", submittedAt: Date.now(), completedAt: -1})
        .exec(callback)
    }
    

}
