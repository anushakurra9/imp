'use strict';
module.exports = {
    noroute: function(req,res,next) {

	if((req.url).includes("dist")){
		return next();
	}

return res.badRequest({"status": "no route"})
		  
    }
}