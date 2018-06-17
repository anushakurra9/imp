'use strict';

const Q = require("q")

module.exports = {
    cacheRecordByTag: function(tag) {
        var deferred = Q.defer()

        CacheRecord.findOne({tag: tag})
        .then(function(existing) {
            let ret = existing
            if (existing && isExpired(existing)) {
                CacheRecord.destroy({tag: tag}).exec(function(err) {})
                ret = null
            }
            deferred.resolve(ret)
        })

        return deferred.promise
    },

    addToCache: function(tag, resStr, ttl) {
        var deferred = Q.defer()

        CacheRecord.destroy({tag: tag})
        .exec(function(err) {
            let rec = {
                tag: tag,
                responseString: resStr,
                createTime: Date.now() / 1000,
                ttl: ttl
            }

            CacheRecord.create(rec)
            .then(function(created) {
                deferred.resolve(created)
            })
        })

        return deferred.promise
    }
}

function isExpired(record) {
    if (!record) {
        return
    }
    let now = Date.now() / 1000
    
    return (now >= (record.createTime + record.ttl))
}