/**
 * FitbitController
 *
 * @description :: Server-side logic for managing Fitbits
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  authorize: function(req, res) {

    FitbitService.authorize(null)

    return res.json({
      todo: sails.config.fitbit
    });
  }
};

