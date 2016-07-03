// FitbitService.js - in api/services
module.exports = {

  authorize: function(code) {


    Fitbit.authorize(code)

  },
  
  getIntraDayData: function(type, date, cb) {
    Fitbit.stepsIntraday(type, date, function(resp, err){

      cb(resp, err)
    })
  }
  
};
