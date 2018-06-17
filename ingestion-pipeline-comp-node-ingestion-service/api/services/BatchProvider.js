'use strict';
const uuidV4 = require('uuid/v4')
const Q = require("q")
const BatchItemProvider = require("./BatchItemProvider")

module.exports = {
    deleteBatch: function(batchId, callback) {
        BatchItemProvider.deleteBatchItems(batchId, function(error, status) {
            if (!error) {
                Batch.destroy({id: batchId}).exec(function(err) {
                    callback(err, err ? {status: "deleted items but could not delete batch"} : {status: "deleted batch", batchId: batchId})}
                )
            }
            else {
                callback(error, {})
            }
        })
    },
    createBatch: function(batch, callback) {
        if (!batch.uid) {
            batch.uid = uuidV4()
        }
        if (batch.status === "submitted") {
            batch.submittedAt = Date.now()
        }
        Batch.create(batch)
        .exec(callback)
    },

    getAllBatches: function(query, pIndex, count, callback) {
        var page = (isNaN(pIndex) || pIndex < 0) ? 0 : pIndex
        var size = (isNaN(count) || count < 0 || count > 100) ? 100 : count

        Batch.find(query ? query : {})
        .skip(pIndex * count)
        .limit(count)
        .then(function(list) {
            callback({
                page: {
                    pIndex: page, count: list ? list.length : 0
                },
                batches: list ? list : []
            })
        })
    },

    getUserBatches: function(userId, callback) {
        
        Batch.find({
            $or: [{createdBy: userId}, {collaborators: {$in: [userId]}}]
        })
        .then(callback)
    },
    getBatchById: function(batchId) {
        var deferred = Q.defer()
        Batch.findOne({id: batchId})
        .then(function(existing) {
            deferred.resolve(existing)
        })

        return deferred.promise
    }, 
    submitBatch: function(batchId, callback) {
        Batch.update({id: batchId}, {status: "submitted", submittedAt: Date.now()})
        .exec(function(error, updated) {
            let batch = updated && updated.length > 0 ? updated[0] : null
            if (!batch) {
                callback(error, batch)
                return
            }
            BatchItemProvider.submitItemsOfBatch(batch.id, function(error, items) {
                callback(error, batch)
            })
        })
    }
}