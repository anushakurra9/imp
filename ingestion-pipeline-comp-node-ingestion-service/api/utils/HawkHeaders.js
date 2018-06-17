'use strict';
const Hawk = require('hawk')

module.exports = {
    generateMacHeader: function(uri, path, hawkId, hawkKey, method) {
        uri = uri.replace('https', 'http');
        const macUrl = uri + path;
        const timestamp = (Math.trunc(Date.now() / 1000));
        const credentials = {
          algorithm: "sha256",
          id: hawkId,
          key: hawkKey
        }
        const options = { credentials, timestamp };
        const header = Hawk.client.header(macUrl, method, options);
        return header.field;        
    }
}