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
    connection: 'devMongodbServer'
  },
  DispatchService: {
    hawkId: "4f130a17-a999-4a90-8d18-803d5bce96e1",
    hawkSecret: "31088fa3-5f0b-4433-bdd4-9d0131808332"
  },
  NotificationService: {
    url: "http://notifications-dev.us.pearson-intl.com",
    hawkId: "5846e351-0b2d-4755-a1bc-0a8f06d0fdcd",
    hawkSecret: "fdebd1e0-77c2-4f94-9fb1-f1ef52bfbd87",
    path: "/v1/notification/content.ingestion.progress",
    enabled: true
  },
  TenantService: {
    url: "http://tenants-api-dev.us.pearson-intl.com",
    hawkId: "8aa95196-2579-4487-8989-7d2b8b1969ab",
    hawkSecret: "f8321a6c-b10a-4804-b4ff-5fd948d81a78",
    userPath: "/user",
    tenantByTagPath: "/v1/tenant/tag/{tag}",
    tenantByHawkIdPath: "/v1/tenant/hawkId/{hawkId}",
    keyByHawkIdPath: "/v1/authkey/hawkId/{hawkId}"
  },
  waitingListCron: (process.env.waitingListCron === "true") ? true : false

};
