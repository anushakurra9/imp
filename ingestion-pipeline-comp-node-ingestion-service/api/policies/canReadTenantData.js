const PermissionsProvider = require("../services/PermissionsProvider")

module.exports = function canReadTenantData(req, res, next) {

    PermissionsProvider.isRequestAuthorizedForReading(req, function(allowance) {
        if (!allowance.allowed) {
            res.status(allowance.code)
            res.send({status: allowance.message})
            return
        }

        req.options.tenant = allowance.tenant
        next()
    })
}