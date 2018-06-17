'use strict';

const HawkHeaders = require("../../utils/HawkHeaders")
const WTM = require("../../utils/WTM")

module.exports = {
    sendIngestionNotification: function(batch, item, receipients, statusCode, message, callback) {
        let config = sails.config.NotificationService

        if (!config.enabled) {
            if (callback) {
                callback()
            }
            return
        }

        var path = config.path

        const headers = { authorization: HawkHeaders.generateMacHeader(config.url, path, config.hawkId, config.hawkSecret, 'POST') };

        let notifPayload = {
            payload: {
                batchId: batch.id,
                itemId: item ? item.id : "",
                statusCode: statusCode,
                message: message ? message : "",
                userIds: receipients
            }
        }

        let request = {
            method: "POST",
            url: config.url + path,
            headers: headers, 
            cacheable: false, 
            body: notifPayload
        }

        WTM.execute(request)
        .then(function(response) {
            var responseData = null
            var responseError = null
            
            try {
                let json = JSON.parse(response.responseString);
                if (response.statusCode === 200) {//success
                    responseData = json
                }
                else {
                    responseError = json
                }
            }
            catch(error) {
                responseError = error
            }

            if (callback) {
                callback(response.statusCode, responseError, responseData)
            }
        })

    }
}