const ItemWLManager = require("../api/services/ItemWaitingListManager")

module.exports.cron = {
      itemWLCron: {
        schedule: '* * * * * *',
        onTick: function() {
          // console.log('waitinglist cron ticked')

          sails.hooks.cron.jobs.itemWLCron.stop()
          if (!sails.config.waitingListCron) {
            console.log('waiting list cron disabled... no-op, going back to sleep')
            return
          }

          ItemWLManager.checkItemsToMap(function() {
            sails.hooks.cron.jobs.itemWLCron.start()
          })
        }
      }
};
