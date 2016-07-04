// FitbitService.js - in api/services
module.exports = {

  authorize: function(code, cb) {
    Fitbit.authorize(code, function(resp, err){
      cb(resp, err)
    })
  },

  getIntraDayData: function(type, date, cb) {
    Fitbit.stepsIntraday(type, date, function(resp, err){
      cb(resp, err)
    })
  }
};
