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
          batchId: {
            type: 'string',
            required: true,
            index: true
          },
          batchCreator: {
            type: 'string',
            required: true,
            index: true
          },
          type: {
            type: 'string',
            required: true
          },
          createdBy: {
            type: 'string',
            required: true
          },
          status: {
            type: 'string',
            required: true,
            defaultsTo: "draft",
            in: ["draft", "submitted", "scheduled", "in-progress", "uploaded", "completed", "failed"]
          },
          metadata: {
            type: 'json',
            required: true
          },
          attempts: {
            type: 'json',
            defaultsTo: []
          },
          result: {
            type: 'json'
          },
          progression: {
            type: 'json',
            defaultsTo: {},
          },
          submittedAt: {
            type: 'integer'
          },
          completedAt: {
            type: 'integer'
          }
    }
  };
  
  