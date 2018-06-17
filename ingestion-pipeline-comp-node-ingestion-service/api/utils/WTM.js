const Q = require("q")
const WebUtil = require("./WebUtil")
const CacheUtil = require("./CacheUtil")

module.exports = {
    execute : function(request) {
        if (!request.cacheable) {
            return directRequest(request)
        }

        if (!request.cacheTag) {
            throw {error: "cache tag is required"}
        }

        return cachedRequest(request)
    }
}

function cachedRequest(request) {
    var deferred = Q.defer()
    CacheUtil.cacheRecordByTag(request.cacheTag)
    .then(function (cacheRecord) {
        if (cacheRecord) {
            let response = {
                request: request,
                isFromCache: true,
                statusCode: 200,
                responseString: cacheRecord.responseString
            }
            deferred.resolve(response)
            return
        }
        //make new call
        WebUtil.execute(request.method, request.url, request.headers, request.body, function(statusCode, responseString) {
            let response = {
                request: request,
                isFromCache: false,
                statusCode: statusCode
            }
            if (statusCode === 200 && responseString) {
                response["responseString"] = responseString

                CacheUtil.addToCache(request.cacheTag, responseString, request.ttl ? request.ttl : 60)
            }


            deferred.resolve(response)
        })
            

    })

    return deferred.promise
}


function directRequest(request) {
    var deferred = Q.defer()
    WebUtil.execute(request.method, request.url, request.headers, request.body, function(statusCode, responseString) {
        let response = {
            request: request,
            isFromCache: false,
            statusCode: statusCode
        }
        if (responseString) {
            response["responseString"] = responseString
        }

        deferred.resolve(response)
    })
    return deferred.promise
}
