/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  }

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  //Batches
  , 'post /v1/batch': 'BatchController.createBatch'
  , 'put /v1/batch/:batchId/submit': 'BatchController.submitBatch'
  , 'get /v1/user/:userId/batch': 'BatchController.getUserBatches'
  , 'DELETE /v1/batch/:batchId': 'BatchController.deleteBatch'

  //Batch Item(s)
  , 'get /v1/batch/:batchId/items': 'BatchItemController.getBatchItems'
  , 'post /v1/batch/:batchId/items': 'BatchItemController.addBatchItems'
  , 'DELETE /v1/item/:itemId': 'BatchItemController.deleteItem'
  , 'PUT /v1/item/:itemId/submit': 'BatchItemController.submitItems'
  , 'PUT /v1/items/submit': 'BatchItemController.submitItems'
  , 'POST /v1/batch/:batchId/links': 'ItemLinksController.addItemLinks'

  //direct submit
  , 'post /v0/direct/enqueue/assets': 'BatchItemController.enqueueV0Assets'
  , 'post /v1/direct/enqueue/items/for/:userId': 'BatchItemController.directEnqueueItems'
  //legacy support
  , 'post /v0/batch/:batchId/assets': 'BatchItemController.addV0Assets'

  //Admin Routes
  , 'get /environment': 'AdminRoutesController.showEnvironmentConfig'
  , 'post /v1/batches/fetch': 'BatchController.getAllBatches'
  , 'post /v1/items/fetch': 'BatchItemController.getAllItems'

  //Dispatch Routes
  , 'get /dispatch/worker/:worker/count/:count': 'DispatchController.getNextDispatchForWorker'
  , 'post /progression/worker/:worker/item/:itemId': 'DispatchController.onProgressionFromWorker'
  
  
  

  , '*': 'NoRouteController.noroute'
};
