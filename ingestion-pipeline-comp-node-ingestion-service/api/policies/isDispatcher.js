const Dispatcher = require("../services/Dispatcher")

module.exports = function isDispatcher(req, res, next) {
    Dispatcher.validateRequest(req, function (err, authorized, artifacts) {
        if (!authorized) {
            return res.unauthorized()
        }
        next()
    })

}