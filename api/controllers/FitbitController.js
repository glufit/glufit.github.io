/**
 * FitbitController
 *
 * @description :: Server-side logic for managing Fitbits
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  authorize: function(req, res) {

    var code = req.query.code

    FitbitService.authorize(code)

    return res.json({
      todo: sails.config.fitbit
    });
  },

  getIntraDayData: function(req, res) {
    var type = req.query.type
    var date = req.query.date

    FitbitService.getIntraDayData(type, date, function(resp, err) {

      return res.json(resp)
    })
  }
};

