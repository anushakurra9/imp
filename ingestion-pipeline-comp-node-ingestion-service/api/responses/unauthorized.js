'use strict';
/**
 * 401 (Unauthorized) Handler
 *
 * Usage:
 * return res.unauthorized();
 *
 */

module.exports = function forbidden () {

  // Get access to `req`, `res`, & `sails`
  var req = this.req
  var res = this.res

  // Set status code
  res.status(401)
  res.send({error: "Unauthorized Access"})

};

