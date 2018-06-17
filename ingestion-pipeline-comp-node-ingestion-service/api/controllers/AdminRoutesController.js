'use strict';
module.exports = {
    showEnvironmentConfig: function(req, res) {
        return res.send({process: process.env, sails: sails.config})
    }
}