// LivongoService.js - in api/services
module.exports = {

  authorize: function(credentials) {
    Livongo.authorize(credentials)
  },
  
  getReadings: function(start, end, cb) {
    Livongo.getReadings(start, end, function(resp, err){
      cb(resp, err)
    })
  }
};
