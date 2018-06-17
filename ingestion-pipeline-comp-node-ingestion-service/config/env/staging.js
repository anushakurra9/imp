/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  port: process.env.PORT || 80,
  
  models: {
    connection: 'stgMongodbServer'
  },
  NotificationService: {
    url: "http://notifications-stg.us.pearson-intl.com",
    hawkId: "3872b0ad-5ec2-47bd-8b7b-5709162e6748",
    hawkSecret: "b9b27555-ffcf-4668-8e7a-9991ef54b0c0",
    path: "/v1/notification/content.ingestion.progress",
    enabled: false
  },
  TenantService: {
    url: "http://tenants-api-stg.us.pearson-intl.com",
    hawkId: "7da0dfe2-5042-4d32-a572-f781055c61f1",
    hawkSecret: "950aa9aa-4733-40e7-a7ae-3120ebbd6d21",
    userPath: "/user",
    tenantByTagPath: "/v1/tenant/tag/{tag}",
    tenantByHawkIdPath: "/v1/tenant/hawkId/{hawkId}",
    keyByHawkIdPath: "/v1/authkey/hawkId/{hawkId}"
  },
  waitingListCron: (process.env.waitingListCron === "true") ? true : false

};
