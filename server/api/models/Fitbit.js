var utils   = require('../utils/utils')
var request = require('request');

var url          = sails.config.fitbit.tokenUri
var clientId     = sails.config.fitbit.clientId
var clientSecret = sails.config.fitbit.clientSecret

module.exports = {

  authorize: function(code, cb) {

    var bearerToken  = new Buffer(clientId + ":" + clientSecret).toString('base64')

    var data = {
      code:         code,
      clientId:     clientId,
      grant_type:   "authorization_code",
      redirect_uri: "http://localhost:1337/fitbit/authorize"
    }

    var headers = {
      'Authorization': 'Basic ' + bearerToken,
      'Content-Type' : 'application/x-www-form-urlencoded'
    }

    var options = {
      url: url,
      headers: headers,
      form: data
    }

    request.post(options, function(err,httpResponse,body){
      utils.handleTokens(body)
      console.log(body)
      cb(body, null)
    })
  },

  refresh: function(cb) {
    var bearerToken  = new Buffer(clientId + ":" + clientSecret).toString('base64')

    var data = {
      grant_type:    "refresh_token",
      refresh_token: sails.config.globals.fitbit.refreshToken
    }

    var headers = {
      'Authorization': 'Basic ' + bearerToken,
      'Content-Type' : 'application/x-www-form-urlencoded'
    }

    var options = {
      url: url,
      headers: headers,
      form: data
    }

    request.post(options, function(err,httpResponse,body){
      utils.handleTokens(body)
    })
  },

  stepsIntraday: function(activityType, date, cb) {

    var headers = {
      'Authorization': 'Bearer ' + sails.config.globals.fitbit.accessToken
    }

    var url = sails.config.fitbit.stepsIntradayUri + activityType + "/date/" + date + "/1d.json"

    var options = {
      url: url,
      headers: headers
    }

    utils.getRequest(options, function(resp,err){
      var data = JSON.parse(resp)["activities-" + activityType + "-intraday"]["dataset"]
      cb(data, null)
    })
  }
};
