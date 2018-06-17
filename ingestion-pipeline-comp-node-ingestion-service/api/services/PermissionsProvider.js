'use strict';

const AuthkeyProvider = require("../services/AuthkeyProvider")
const TenantsAPI = require("../thirdparty/TenantsService/TenantsAPI")

module.exports = {
    
    isRequestAuthorizedForReading: function(req, callback) {
        AuthkeyProvider.validateRequest(req, function (err, authkey, artifacts) {
            if (!authkey || !artifacts) {
                callback({allowed: false, code: 403, message: "invalid signature"})
                return
            }

//Tenant Id specific, ensure its the right tenant.
            TenantsAPI.findTenantByHawkId(authkey.hawkID, function(statusCode, error, tenant) {
                if (!tenant) {
                    callback({allowed: false, code: 400, message: "cannot find the tenant with ID:" + authkey.hawkID})
                    return
                }
                return callback({allowed: true, code: 200, tenant: tenant})                
            })
        })        
    }
}