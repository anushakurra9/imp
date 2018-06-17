'use strict';

const HawkHeaders = require("../../utils/HawkHeaders")
const WTM = require("../../utils/WTM")

module.exports = {
    findUserBySessionToken: function(token, callback) {
        if (!token) {
            callback(401, "missing token", null)
            return
        }
        let config = sails.config.TenantService

        var path = config.userPath

        const headers = { token: token };

        let request = {
            method: "GET",
            url: config.url + path,
            headers: headers, 
            cacheable: true, 
            cacheTag: "user_for_token:" + token,
            ttl: 60*60
        }

        WTM.execute(request)
        .then(function(response) {
            var responseData = null;
            var responseError = null;
            
            try {
                let json = JSON.parse(response.responseString);
                if (response.statusCode === 200) {//success
                    responseData = json
                }
                else {
                    responseError = json;
                }
            }
            catch(error) {
                responseError = error;
            }
            callback(response.statusCode, responseError, responseData);
            
        })

    },
    findAuthKeyByHawkId: function(hawkId, callback) {
        let config = sails.config.TenantService

        var path = config.keyByHawkIdPath.replace("{hawkId}", hawkId);

        const headers = { authorization: HawkHeaders.generateMacHeader(config.url, path, config.hawkId, config.hawkSecret, 'GET') };


        let request = {
            method: "GET",
            url: config.url + path,
            headers: headers, 
            cacheable: true, 
            cacheTag: "authkey_for_hawkId:" + hawkId,
            ttl: 60*60*24
        }

        WTM.execute(request)
        .then(function(response) {
            var responseData = null;
            var responseError = null;
            
            try {
                let json = JSON.parse(response.responseString);
                if (response.statusCode === 200) {//success
                    responseData = json
                }
                else {
                    responseError = json;
                }
            }
            catch(error) {
                responseError = error;
            }
            callback(response.statusCode, responseError, responseData);
        })

    },    
    findTenantByHawkId: function(hawkId, callback) {
        let config = sails.config.TenantService

        var path = config.tenantByHawkIdPath.replace("{hawkId}", hawkId);

        const headers = { authorization: HawkHeaders.generateMacHeader(config.url, path, config.hawkId, config.hawkSecret, 'GET') };

        let request = {
            method: "GET",
            url: config.url + path,
            headers: headers, 
            cacheable: true, 
            cacheTag: "tenant_for_hawkId:" + hawkId,
            ttl: 60*60*24
        }
        
        WTM.execute(request)
        .then(function(response) {
            var responseData = null;
            var responseError = null;
            
            try {
                let json = JSON.parse(response.responseString);
                if (response.statusCode === 200) {//success
                    responseData = json
                }
                else {
                    responseError = json;
                }
            }
            catch(error) {
                responseError = error;
            }
            callback(response.statusCode, responseError, responseData);
        })

    },    
    findTenantByTag: function(tag, callback) {
        let config = sails.config.TenantService

        var path = config.tenantByTagPath.replace("{tag}", tag);

        const headers = { authorization: HawkHeaders.generateMacHeader(config.url, path, config.hawkId, config.hawkSecret, 'GET') };

        let request = {
            method: "GET",
            url: config.url + path,
            headers: headers, 
            cacheable: true, 
            cacheTag: "tenant_for_tag:" + tag,
            ttl: 60*60*24
        }

        WTM.execute(request)
        .then(function(response) {
            var responseData = null;
            var responseError = null;
            
            try {
                let json = JSON.parse(response.responseString);
                if (response.statusCode === 200) {//success
                    responseData = json
                }
                else {
                    responseError = json;
                }
            }
            catch(error) {
                responseError = error;
            }

            callback(response.statusCode, responseError, responseData);
            
        })

    }
}