/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    schema :true,
      attributes: {
            tag: {
              type: 'string',
              required :true,
              index:true
            },
            createTime: {
                type: 'integer',
                required :true
            },
            responseString: {
                type: 'string'
            },
            ttl: {
                type: 'integer',
                required: true            
            }
      }
    };
    
    