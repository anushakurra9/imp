/**
 * BatchItemController
 *
 * @description :: Server-side logic for managing Batchitems
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const BatchItemProvider = require("../services/BatchItemProvider")
const BatchProvider = require("../services/BatchProvider")
const ItemWLManager = require("../services/ItemWaitingListManager")
const Q = require("q")
const uuidV4 = require('uuid/v4')

module.exports = {
    ///v1/batch/:batchId/links
    //link {type: "cartridge-asset", cartridgeUID: xxxx, assetUID: xxxx}
    addItemLinks: function (req, res) {
        let batchId = req.param("batchId")

        let links = req.body["links"]
        if (!links || links.length === 0) {
            return res.badRequest({ reason: "nothing to add" })
        }

        let validLinks = []
        let invalidLinks = []
        links.forEach(function (link) {
            if ((link.type === "cartridge-asset" && (link.cartridgeUID || link.cartridgeUID) && (link.assetUID || link.assetId))
                || (link.type === "cartridge-school" && (link.cartridgeUID || link.cartridgeId) && (link.schoolUID || link.schoolId))
                || (link.type === "class-school" && link.classUID && link.schoolUID)
                || (link.type === "course-cartridge" && (link.courseUID || link.courseId) && (link.cartridgeUID || link.cartridgeId))
                || (link.type === "course-school" && (link.courseUID || link.courseId) && (link.schoolUID || link.schoolId))
                || (link.type === "school-user" && (link.schoolUID || link.schoolId) && (link.userUID || link.userId) && link.roleValue) //map new/existing user to new/existing school
            ) {
                validLinks.push(link)
            }
            else {
                invalidLinks.push(links)
            }
        })

        if (invalidLinks.length > 0) {
            return res.badRequest({ invalidLinks: invalidLinks })
        }


        BatchProvider.getBatchById(batchId)
            .then(function (batch) {
                if (!batch) {
                    return res.notFound({ reason: "invalid batchId" })
                }

                processLinks(batch, validLinks)
                    .then(function (result) {
                        return res.send(result)
                    })
            })
    },

};

function processLinks(batch, links) {
    var deferred = Q.defer()

    let newItems = []
    let createdItems = []
    links.forEach(function (link) {
        if (link.type === "cartridge-asset") {
            let item = {
                batchCreator: batch.createdBy,
                createdBy: batch.createdBy,
                type: link.type,
                metadata: {
                    cartridgeUID: link.cartridgeUID,
                    assetUID: link.assetUID
                },
                progression: {},
                uid: uuidV4(),
                status: "submitted",
                batchId: batch.id
            }
            if (link.cartridgeId) {
                item.progression.cartridgeId = link.cartridgeId
            }
            else if (link.cartridgeUID) {
                item.metadata.cartridgeUID = link.cartridgeUID
            }

            if (link.assetId) {
                item.progression.assetId = link.assetId
            }
            else if (link.assetUID) {
                item.metadata.assetUID = link.assetUID
            }
            
            newItems.push(item)
        }
        else if (link.type === "cartridge-school") {
            let item = {
                batchCreator: batch.createdBy,
                createdBy: batch.createdBy,
                type: link.type,
                metadata: {},
                progression: {},
                uid: uuidV4(),
                status: "submitted",
                batchId: batch.id
            }
            if (link.cartridgeId) {
                item.progression.cartridgeId = link.cartridgeId
            }
            else if (link.cartridgeUID) {
                item.metadata.cartridgeUID = link.cartridgeUID
            }

            if (link.schoolId) {
                item.progression.schoolId = link.schoolId
            }
            else if (link.schoolUID) {
                item.metadata.schoolUID = link.schoolUID
            }
            
            newItems.push(item)
        }
        else if (link.type === "course-cartridge") {
            let item = {
                createdBy: batch.createdBy,
                batchCreator: batch.createdBy,
                type: link.type,
                metadata: {},
                progression: {},
                uid: uuidV4(),
                status: "submitted",
                batchId: batch.id
            }
            if (link.cartridgeId) {
                item.progression.cartridgeId = link.cartridgeId
            }
            else if (link.cartridgeUID) {
                item.metadata.cartridgeUID = link.cartridgeUID
            }

            if (link.courseId) {
                item.progression.courseId = link.courseId
            }
            else if (link.courseUID) {
                item.metadata.courseUID = link.courseUID
            }

            
            newItems.push(item)
        }
        else if (link.type === "course-school") {
            let item = {
                createdBy: batch.createdBy,
                batchCreator: batch.createdBy,
                type: link.type,
                metadata: {},
                progression: {},
                uid: uuidV4(),
                status: "submitted",
                batchId: batch.id
            }
            if (link.schoolId) {
                item.progression.schoolId = link.schoolId
            }
            else if (link.schoolUID) {
                item.metadata.schoolUID = link.schoolUID
            }

            if (link.courseId) {
                item.progression.courseId = link.courseId
            }
            else if (link.courseUID) {
                item.metadata.courseUID = link.courseUID
            }
            newItems.push(item)
        }
        else if (link.type === "school-user") {
            let item = {
                createdBy: batch.createdBy,
                batchCreator: batch.createdBy,
                type: link.type,
                metadata: {
                    roleValue: link.roleValue
                },
                progression: {},
                uid: uuidV4(),
                status: "submitted",
                batchId: batch.id
            }
            if (link.schoolId) {
                item.progression.schoolId = link.schoolId
            }
            else if (link.schoolUID) {
                item.metadata.schoolUID = link.schoolUID
            }
            if (link.userId) {
                item.progression.userId = link.userId
            }
            else if (link.userUID) {
                item.metadata.userUID = link.userUID
            }
            newItems.push(item)
        }
        else if (link.type === "class-school") {
            createdItems.push({
                uid: link.classUID
                , type: "coursesection"
                , metadata: { schoolUID: link.schoolUID }
            })
        }
        else {
            throw { error: "link type not yet handled" }
        }
    })

    BatchItemProvider.addBatchItems(batch.id, true, newItems, function (error, created) {
        if (created && created.length > 0) {
            createdItems = createdItems.concat(created)
        }

        ItemWLManager.onNewItemsCreated(createdItems, function () {
            deferred.resolve(createdItems)
        })

    })


    return deferred.promise
}

