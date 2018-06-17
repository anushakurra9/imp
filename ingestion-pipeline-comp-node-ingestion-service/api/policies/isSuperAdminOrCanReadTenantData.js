const isSuperAdmin = require("./isSuperAdmin")
const canReadTenantData = require("./canReadTenantData")

module.exports = function isSuperAdminOrCanReadTenantData(req, res, next) {
    if (req.headers.token) {
        return isSuperAdmin(req, res, next)
    }
    return canReadTenantData(req, res, next);
}