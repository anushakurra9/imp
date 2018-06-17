'use strict';
const uuidV4 = require('uuid/v4')
const SchoolValidator = require("./SchoolValidator")
const AssetValidator = require("./AssetValidator")
const CartridgeValidator = require("./CartridgeValidator")
const ClassValidator = require("./ClassValidator")
const UserValidator = require("./UserValidator")
const supportedTypes = {
    school: {
        supported: true
    },
    asset: {
        supported: true
    },
    cartridge: {
        supported: true
    },
    coursesection: {
        supported: true
    },
    course: {
        supported: true
    },
    user: {
        supported: true
    }
}

module.exports = {
    validateNewInput: function(batch, items) {
        let errors = []
        let uids = []
        items.forEach(function(item) {
            if (!item.uid) {
                item.uid = uuidV4()
            }
            if (!item.progression) {
                item.progression = {}
            }

            if (item.status === "submitted") {
                item.submittedAt = Date.now()
            }

            item.batchId = batch.id
            item.batchCreator = batch.createdBy
            uids[uids.length] = item.uid
            if (!item.createdBy) {
                item.createdBy = item.batchCreator
            }

            
            var typeSupported = supportedTypes[item.type] && supportedTypes[item.type].supported ? true : false
            if (!typeSupported) {
                errors[errors.length] = {error: "unsupported type", item: item}
            }

            if (typeSupported && "school" === item.type) {
                item.metadata = SchoolValidator.validate(item.metadata)
            }
            else if (typeSupported && "cartridge" === item.type) {
                item.metadata = CartridgeValidator.validate(item.metadata)
            }
            else if (typeSupported && "coursesection" === item.type) {
                item.metadata = ClassValidator.validate(item.metadata)
            }
            else if (typeSupported && "course" === item.type) {
                item.metadata = item.metadata //TODO: should we have validation for all of these or trust the caller?
            }
            else if (typeSupported && "user" === item.type) {
                item.metadata = UserValidator.validate(item.metadata)
            }
            else if (typeSupported) {//TODO: default treat as "asset"
                item.metadata = AssetValidator.validate(item.metadata)
                if (item.metadata.sourceUrl) {
                    item.progression.source = {url: item.metadata.sourceUrl}
                    delete item.metadata.sourceUrl
                }

                if (item.metadata.packageRoot) {
                    item.progression.package = {root: item.metadata.packageRoot}
                    delete item.metadata.packageRoot
                }

                if (item.metadata.supportsOffline) {
                    item.progression.supportsOffline = item.metadata.supportsOffline
                    delete item.metadata.supportsOffline                    
                }

                //handle book objects
                var bookReference = null
                if (item.metadata.bookId) {
                    bookReference = {source: "reader+", originId: item.metadata.bookId}
                    delete item.metadata.bookId
                }
                if (!bookReference && item.metadata.externalRef && item.metadata.externalRef.length > 0) {
                    item.metadata.externalRef.forEach(function(aRef) {
                        if (aRef.source === "reader+") {
                            bookReference = aRef
                        }
                    })
                }
                if (bookReference) {
                    item.progression.book = {id: bookReference.originId}
                }
                //end - handle book objects
            }

            if (!item.metadata) {
                errors[errors.length] = {error: "invalid metadata", item: item}
            }
            
        })

        let ret = {
            uids: uids,
            errors: errors,
            items: items
        }
        return ret
    }
}