/**
 * ItemWaitList.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema :true,
  attributes: {
    item1UID: {
      type: 'string',
      required: true,
      index:true
    },
    item2UID: {
      type: 'string',
      required: true,
      index:true
    },
    item2Type: {
      type: 'string',
      required: true
    },
    waiting: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    }
  }
};

