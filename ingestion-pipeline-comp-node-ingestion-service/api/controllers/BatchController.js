/**
 * BatchController
 *
 * @description :: Server-side logic for managing Batches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const BatchProvider = require("../services/BatchProvider")
module.exports = {
    deleteBatch: function(req, res) {
        let batchId = req.param("batchId")
        BatchProvider.deleteBatch(batchId, function(error, status) {
            res.send({error: error, status: status})
        })

    },

	createBatch: function(req, res) {
        let batch = req.body["batch"]
        
        BatchProvider.createBatch(batch, function(error, created) {
            if (error) {
                return res.badRequest(error)
            }
            res.send(created)

        })
    },

    getAllBatches: function(req, res) {
        var pIndex = 0
        try {
            pIndex = parseInt(req.param("pIndex"))
        }
        catch(err) {}

        var count = 10
        try {
            count = parseInt(req.param("count"))
        }
        catch(err) {}

        var query = req.body["query"] ? req.body["query"] : {}
        
        BatchProvider.getAllBatches(query, pIndex, count, function(batches) {
            res.send(batches)
        })        
    },

    getUserBatches: function(req, res) {
        let userId = req.param("userId")
        BatchProvider.getUserBatches(userId, function(batches) {
            res.send(batches)
        })
    },

    submitBatch: function(req, res) {
        let batchId = req.param("batchId")
        BatchProvider.submitBatch(batchId, function(error, result) {
            if (error) {
                return res.badRequest(error)
            }
            res.send(result)
        })
    }
};

