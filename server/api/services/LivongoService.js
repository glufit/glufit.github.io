// LivongoService.js - in api/services
module.exports = {

  authorize: function(credentials, cb) {
    Livongo.authorize(credentials, function(resp, err){
      cb(resp)
    })
  },

  getReadings: function(start, end, cb) {
    Livongo.getReadings(start, end, function(resp, err){
      cb(resp, err)
    })
  }
};
