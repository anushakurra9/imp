const https = require('https');
const http = require('http');
const URL = require('url');

module.exports = {
    execute: function(method, url, headers, body, callback) {
      const myURL = URL.parse(url);
      const event = {
        "options": {
          "hostname": myURL.hostname,
          "path": myURL.path,
          "method": method,
          "headers": headers
        },
        "protocol": myURL.protocol
      };

      if (myURL.port) {
        event.options["port"] = myURL.port
      }


      if (body) {
        event.data = body
      }
            
      let HTTP = myURL.protocol === "http:" ? http : https;
  
      const req = HTTP.request(event.options, (res) => {
          let body = '';
          let statusCode = 200
          res.setEncoding('utf8');
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => {
  
              callback(res.statusCode, body);
          });
      });
      req.on('error', callback);
      if (event.data) {
        req.write(JSON.stringify(event.data));
      }
      req.end();
      
    },
    
    get2: function(url, headers, callback) {
      const myURL = URL.parse(url);
      const event = {
        "options": {
          "hostname": myURL.hostname,
          "path": myURL.path,
          "method": "GET",
          "headers": headers ? headers : {}
        },
        "data": {},
        "protocol": myURL.protocol
      };

      if (myURL.port) {
        event.options["port"] = myURL.port
      }
      
      let HTTP = myURL.protocol === "http:" ? http : https;
      const req = HTTP.request(event.options, (res) => {
          let body = '';
          let statusCode = 200
          res.setEncoding('utf8');
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => {
  
              callback(res.statusCode, body);
          });
      });
      req.on('error', callback);
      req.write(JSON.stringify(event.data));
      req.end();
  
    }
  };
  