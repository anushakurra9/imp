/**
 * BatchController
 *
 * @description :: Server-side logic for managing Batches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const Dispatcher = require("../services/Dispatcher")
const BatchProvider = require("../services/BatchProvider")
const BatchItemProvider = require("../services/BatchItemProvider")
const Validator = require("../utils/Validator")

const Q = require("q")

module.exports = {
    getNextDispatchForWorker: function(req, res) {
        let worker = req.param("worker")
        let count = req.param("count")
        let skip_schedule = req.param("skip_schedule") === "true" ? true : false
        Dispatcher.getNextDispatchForWorker(worker, skip_schedule, count)
        .then(function(items) {
            res.send(items)
        })
    },
    onProgressionFromWorker: function(req, res) {
        let worker = req.param("worker")
        let itemId = req.param("itemId")
        //from body
        let attempts = req.body["attempts"]
        let result = req.body["result"]

        BatchItemProvider.getItemById(itemId)
        .then(function(item) {
            if (!item) {
                return res.send({error: "Invalid Item #: " + itemId})
            }

            BatchProvider.getBatchById(item.batchId)
            .then(function(batch) {
                if (!batch) {
                    return res.send({error: "Invalid batch #: " + item.batchId + " for item#: " + itemId})
                }

                Dispatcher.onProgressionFromWorker(worker, item, batch, attempts, result)
                .then(function(updatedItem) {
                    return res.send(updatedItem)
                })
            })
        })
    },

};
