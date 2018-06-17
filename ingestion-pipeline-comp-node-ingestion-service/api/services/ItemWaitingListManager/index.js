'use strict';
const Q = require("q")
const Arrays = require("../../utils/Arrays")
const BatchItemProvider = require("../BatchItemProvider")
//TODO: BatchIt for a larger number this moves faster but queries don't execute. :-(
const kPageSize = 1 
const kItemMap = {
    cartridge: {
        progressionKeyFrom: "progression.cartridge.id",
        progressionKeyTo: "progression.cartridgeId"
    },
    school: {
        progressionKeyFrom: "progression.school.id",
        progressionKeyTo: "progression.schoolId"
    },
    asset: {
        progressionKeyFrom: "progression.asset.id",
        progressionKeyTo: "progression.assetId"
    },
    course: {
        progressionKeyFrom: "progression.course.id",
        progressionKeyTo: "progression.courseId"        
    },
    user: {
        progressionKeyFrom: "progression.user.uid",
        progressionKeyTo: "progression.userId"        
    }
}

Object.byString = function(o, s) {
    if (!o) {
        return null
    }
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

Object.setByString = function(o, s, value) {
    var schema = o;  // a moving reference to internal objects within obj
    var pList = s.split('.');
    var len = pList.length;
    for(var i = 0; i < len-1; i++) {
        var elem = pList[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
    }

    schema[pList[len-1]] = value;    
}


module.exports = {
    checkItemsToMap: function(next) {
        ItemWaitList.destroy({waiting: false})
        .exec(function(err) {
            checkWaitingList(0, kPageSize, next)
        })

    },

    //TODO: instead this should be explict only for "map" items
    onNewItemsCreated: function(createdItems, callbackOrNull) {
        let uidsDict = Arrays.dictionarize(createdItems, "uid")
        let wl = []
        createdItems.forEach(function(item) {
            if (item && "cartridge-asset" === item.type) {
                if (item.metadata.cartridgeUID) {
                    wl[wl.length] = {
                        item1UID: item.uid,
                        item2UID: item.metadata.cartridgeUID,
                        item2Type: "cartridge"
                    }    
                }

                if (item.metadata.assetUID) {
                    wl[wl.length] = {
                        item1UID: item.uid,
                        item2UID: item.metadata.assetUID,
                        item2Type: "asset"
                    }    
                }
            }
            else if (item && "cartridge-school" === item.type) {
                if (item.metadata.cartridgeUID) {
                    wl[wl.length] = {
                        item1UID: item.uid,
                        item2UID: item.metadata.cartridgeUID,
                        item2Type: "cartridge"
                    }
                }

                if (item.metadata.schoolUID) {
                    wl[wl.length] = {
                        item1UID: item.uid,
                        item2UID: item.metadata.schoolUID,
                        item2Type: "school"
                    }    
                }
            }
            else if (item && "course-cartridge" === item.type) {
                if (item.metadata.cartridgeUID) {
                    wl[wl.length] = {
                        item1UID: item.uid,
                        item2UID: item.metadata.cartridgeUID,
                        item2Type: "cartridge"
                    }
                }
                if (item.metadata.courseUID) {
                    wl[wl.length] = {
                        item1UID: item.uid,
                        item2UID: item.metadata.courseUID,
                        item2Type: "course"
                    }
                }

            }
            else if (item && "course-school" === item.type) {
                if (item.metadata.schoolUID) {
                    wl[wl.length] = {
                        item1UID: item.uid,
                        item2UID: item.metadata.schoolUID,
                        item2Type: "school"
                    }
                }

                if (item.metadata.courseUID) {
                    wl[wl.length] = {
                        item1UID: item.uid,
                        item2UID: item.metadata.courseUID,
                        item2Type: "course"
                    }
                }
            }
            else if (item && "school-user" === item.type) {
                if (item.metadata.schoolUID) {
                    wl[wl.length] = {
                        item1UID: item.uid,
                        item2UID: item.metadata.schoolUID,
                        item2Type: "school"
                    }
                }
                if (item.metadata.userUID) {
                    wl[wl.length] = {
                        item1UID: item.uid,
                        item2UID: item.metadata.userUID,
                        item2Type: "user"
                    }
                }
            }
            else if (item && "coursesection" === item.type) {
                wl[wl.length] = {
                    item1UID: item.uid,
                    item2UID: item.metadata.schoolUID,
                    item2Type: "school"
                }
            }            
        })

        ItemWaitList.create(wl)
        .exec(function(error, created) {
            if (error) {
                console.error("failed to create WL", JSON.stringify(error))
            }

            if (callbackOrNull) {
                callbackOrNull()
            }
        })
    }
}

function checkWaitingList(pIndex, count, next) {
    ItemWaitList.find({waiting: true})
    .skip(pIndex * count)
    .limit(count)
    .exec(function(error, list) {
        if (error || !list || list.length === 0) {
            return next()
        }
        //check if any wait is over in this batch.
        checkIfAnyWaitIsOver(list)
        .then(function(result) {
            if (result && result.keepLooking) {
                checkWaitingList(pIndex+1, count, next)
            }
            else {
                next()
            }
        })
    })
}

function checkIfAnyWaitIsOver(waitingList) {


    var deferred = Q.defer()

    let id1List = Arrays.getKeys(waitingList, "item1UID")
    let id2List = Arrays.getKeys(waitingList, "item2UID")

    let ids = id1List.concat(id2List)

    BatchItem.find({
        uid: {$in: ids}
    })
    .then(function(batchItems) {

        var keepLooking = true

        if (!batchItems) {
            deferred.resolve({keepLooking: keepLooking})
            return
        }


        let batchItemsDictionary = Arrays.dictionarize(batchItems, "uid")

        //we have items that might be ready
        //we have items that are waiting
        //we know who is waiting for what.
        waitingList.forEach(function(waitingItem) {
            let item1 = batchItemsDictionary[waitingItem.item1UID]
            let item2 = batchItemsDictionary[waitingItem.item2UID]

            let ID = Object.byString(item2, kItemMap[waitingItem.item2Type].progressionKeyFrom)
            if (ID) {
                Object.setByString(item1, kItemMap[waitingItem.item2Type].progressionKeyTo, ID)
                waitingItem.waiting = false
                item1.save()
                waitingItem.save()
                keepLooking = false
            }
        })

        deferred.resolve({keepLooking: keepLooking})
        
        
    })

    return deferred.promise
}

