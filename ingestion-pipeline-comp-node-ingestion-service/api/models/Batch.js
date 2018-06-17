/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
const uuidV4 = require('uuid/v4')

module.exports = {
  schema :true,
    attributes: {
          uid: {
            type: 'string',
            required :true,
            unique: true,
            index:true
          },
          createdBy: {
            type: 'string',
            required: true
          },
          name: {
            type: 'string',
            required: true
          },
          description: {
            type: 'string',
            required: true
          },
          collaborators: {
            type: 'array',
            required: false
          },
          status: {
            type: 'string',
            required: true,
            defaultsTo: "draft",
            in: ["draft", "submitted", "in-progress", "completed"]
          },
          submittedAt: {
            type: 'integer'
          },
          completedAt: {
            type: 'integer'
          }
    }
  };
  
  