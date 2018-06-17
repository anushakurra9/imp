/**
 * BatchItemController
 *
 * @description :: Server-side logic for managing Batchitems
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 const BatchItemProvider = require("../services/BatchItemProvider")
 const Validtor = require("../utils/Validator")
 const BatchProvider = require("../services/BatchProvider")
 const Q = require("q")
 const Arrays = require("../utils/Arrays")
 const uuidV4 = require('uuid/v4')

module.exports = {
    deleteItem: function(req, res) {
        let itemId = req.param("itemId")
        BatchItemProvider.deleteItem(itemId, function(error, status) {
            res.send({error: error, status: status})
        })
    },

    getAllItems: function(req, res) {
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
        
        BatchItemProvider.getAllItems(query, pIndex, count, function(items) {
            res.send(items)
        })        

    },

	getBatchItems: function(req, res) {
        let batchId = req.param("batchId")
        BatchItemProvider.getBatchItems(batchId, function(items) {
            res.send(items)
        })
    },

    submitItems: function(req, res) {
        let itemIds = req.param("itemId") ? [req.param("itemId")] : req.body["itemIds"]
        if (!itemIds || itemIds.length == 0) {
            return res.badRequest()
        }

        BatchItemProvider.submitItems(itemIds, function(error, status) {
            res.send({error: error, status: status})
        })

    },

    addBatchItems: function(req, res) {
        let batchId = req.param("batchId")
        let items = req.body["items"]

        //Validations
        if (!batchId || !items || !items.length) {
            return res.badRequest({error: "batchId & items are necessary"})
        }
        

        BatchItemProvider.addBatchItems(batchId, false, items, function(error, created) {
            let result = {}
            if (created) {
                result.created = created
            }
            if (error) {
                result.error = error
            }
            res.send(result)
        })
    }, 

    addV0Assets: function(req, res) {
        let batchId = req.param("batchId")
        let assets = req.body["assets"]
        //Validations
        if (!batchId || !assets || !assets.length) {
            return res.badRequest({error: "batchId & assets are necessary"})
        }

        let items = convertV0AssetsToV1Items(assets)
        
        BatchItemProvider.addBatchItems(batchId, false, items, function(error, created) {
            let result = {}
            if (created) {
                result.created = created
            }
            if (error) {
                result.error = error
            }
            res.send(result)
        })        
    },

    directEnqueueItems: function(req, res) {
        let items = req.body["items"] ? req.body["items"] : []
        let userId = req.param("userId")
        let assets = req.body["assets"] ? req.body["assets"] : []
        
        let assetItems = convertV1AssetsToV1Items(assets)
        items = items.concat(assetItems)

        //Validations
        if (!items || !items.length) {
            return res.badRequest({error: "items are necessary"})
        }
        let uid = uuidV4()
        let batch = {
            name: uid,
            createdBy: userId,
            description: "direct batch",
            uid: uid
        }
        BatchProvider.createBatch(batch, function(error, createdBatch) {
            if (error) {
                res.serverError(error)
                return
            }
            BatchItemProvider.addBatchItems(createdBatch.id, false, items, function(error, createdItems) {
                BatchProvider.submitBatch(createdBatch.id, function(error, submittedBatch) {
                    res.send({items: createdItems, batch: submittedBatch})
                })
            })                
        })

    },

    enqueueV0Assets: function(req, res) {
        let assets = req.body["assets"]
        //Validations
        if (!assets || !assets.length) {
            return res.badRequest({error: "assets are necessary"})
        }
        let items = convertV0AssetsToV1Items(assets)
        let uid = uuidV4()
        let batch = {
            name: uid,
            createdBy: "padmin",
            description: "direct batch",
            uid: uid
        }
        BatchProvider.createBatch(batch, function(error, createdBatch) {
            if (error) {
                res.serverError(error)
                return
            }
            BatchItemProvider.addBatchItems(createdBatch.id, false, items, function(error, createdItems) {
                BatchProvider.submitBatch(createdBatch.id, function(error, submittedBatch) {
                    res.send({items: createdItems, batch: submittedBatch})
                })
            })                
        })
    }
};

function convertV1AssetsToV1Items(assets) {
    let items = []
    assets.forEach(function(asset) {
        items.push({
            createdBy: asset.createdBy,
            type: "asset",
            uid: asset.uid ? asset.uid : uuidV4(),
            metadata: asset
        })
    })
    return items
}

function convertV0AssetsToV1Items(assets) {
    let items = []
    assets.forEach(function(asset) {
        var metadata = {
            name: asset.name,
            description: asset.description,
            contentTypeValue: asset.contentTypeValue,
            fileType: asset.fileType,
            section: asset.section,
            sectionOrder: asset.sectionOrder ? asset.sectionOrder : 999,
            order: asset.order ? asset.order : 999,
            hidetoc: asset.hidetoc ? asset.hidetoc : false,
            maxattempt: asset.maxattempt ? asset.maxattempt : 1,
            maxgrade: asset.maxgrade ? asset.maxgrade : 100,
            limitByRoles: asset.limitByRoles ? asset.limitByRoles.split(",") : ["teacher", "student"],
            isDownloadable: asset.isDownloadable ? asset.isDownloadable : false,
            isViewable: asset.isViewable ? asset.isViewable : true,
            purposes: asset.purposes ? asset.purposes.split(",") : []
        }
        var progression = {}

        if (asset.thumbnailUrl) {
            metadata.thumbnailUrl = asset.thumbnailUrl
        }
        if (asset.topic) {
            metadata.topic = {name: asset.topic}
        }
        if (asset.subtopic1) {
            metadata.topic.subtopic = {name: asset.subtopic1}
        }
        if (asset.subtopic1 && asset.subtopic2) {
            metadata.topic.subtopic.subtopic = {name: asset.subtopic2}
        }
        if (asset.url) {
            metadata.url = asset.url
        }
        if (asset.authType) {
            metadata.authType = asset.authType
        }
        if (asset.sourceUrl) {
            progression.source = {url: asset.sourceUrl}
        }
        if (asset.packageRoot) {
            progression.package = {root: asset.packageRoot}
        }
        if (asset.supportsOffline) {
            progression.supportsOffline = asset.supportsOffline
        }

        var bookReference = null
        if (asset.externalRef) {
            metadata.externalRef = []
            let refs = asset.externalRef.split(",")
            refs.forEach(function(aRef) {
                let refData = aRef.split("|")
                let exRef = {source: refData[0], originId: refData[1]}
                metadata.externalRef.push(exRef)
                if ("reader+" === exRef.source) {
                    bookReference = exRef
                }
            })
        }

        //handle bookIds for R+ objects.
        if (!bookReference && asset.bookId) {
            bookReference = {source: "reader+", originId: asset.bookId}
        }
        if (bookReference) {
            progression.book = {id: bookReference.originId}
        }

        items.push({
            createdBy: asset.createdBy,
            type: "asset",
            uid: asset.uid ? asset.uid : uuidV4(),
            metadata: metadata,
            progression: progression
        })
    })

    return items

}
