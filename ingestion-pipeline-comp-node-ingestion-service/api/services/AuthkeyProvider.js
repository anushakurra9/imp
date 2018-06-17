'use strict';
const uuidV4 = require('uuid/v4')
const Hawk = require('hawk')
const Q = require("q")
const TenantsAPI = require("../thirdparty/TenantsService/TenantsAPI")

module.exports = {
    validateRequest: function(request, callback) {
        Hawk.server.authenticate(request, hawkCredentialsFunction, {}, function (err, credentials, artifacts) {
            callback(err, (!err && credentials) ? credentials.authkey : null, artifacts)
        });
    }
}

function hawkCredentialsFunction(hawkId, callback) {

  var deferred = Q.defer()
  TenantsAPI.findAuthKeyByHawkId(hawkId, function(statusCode, error, authkey) {
    var credentials = {
        key: authkey ? authkey["hawkKey"] : "na",
        algorithm: authkey ? authkey["algorithm"] : "sha256",
        authkey: authkey
      }
      deferred.resolve(callback(null, credentials))
  })
  return deferred.promise

}
