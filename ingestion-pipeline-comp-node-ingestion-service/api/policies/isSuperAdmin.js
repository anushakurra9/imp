const TenantsAPI = require("../thirdparty/TenantsService/TenantsAPI")

module.exports = function isSuperAdmin(req, res, next) {
    TenantsAPI.findUserBySessionToken(req.headers["token"], function (statusCode, error, caller) {
        if (!caller || caller.roleValue != "super-admin") {
            return res.unauthorized()
        }

        req.options.caller = caller
        next()
    })

}