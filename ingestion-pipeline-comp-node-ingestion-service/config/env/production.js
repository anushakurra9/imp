/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  port: process.env.PORT || 80,

  models: {
    connection: 'prodMongodbServer'
  },
  NotificationService: {
    url: "http://notifications.us.pearson-intl.com",
    hawkId: "2b54c38c-66a0-4dcf-949a-132aa829ee84",
    hawkSecret: "24660347-099e-40fd-9650-c186bb646b8e",
    path: "/v1/notification/content.ingestion.progress",
    enabled: false
  },
  TenantService: {
    url: "http://tenants-api.us.pearson-intl.com",
    hawkId: "edc33e06-26ab-4b29-9ee4-423350a20df0",
    hawkSecret: "558b864c-c3f7-4b45-9dfe-b57454353943",
    userPath: "/user",
    tenantByTagPath: "/v1/tenant/tag/{tag}",
    tenantByHawkIdPath: "/v1/tenant/hawkId/{hawkId}",
    keyByHawkIdPath: "/v1/authkey/hawkId/{hawkId}"
  },
  waitingListCron: (process.env.waitingListCron === "true") ? true : false,
  keepResponseErrors: true
};
