/**
 * LivongoController
 *
 * @description :: Server-side logic for managing livongoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  authorize: function(req, res) {

    var credentials = req.body

    LivongoService.authorize(credentials)

    return res.json({});
  },

  getReadings: function(req, res) {
    var start = req.query.start
    var end = req.query.end
    LivongoService.getReadings(start, end, function(resp, err) {
      return res.json(resp)
    })
  }
};

