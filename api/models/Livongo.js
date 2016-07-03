var request = require('request');

module.exports = {
  authorize: function(credentials, cb) {
    var url = sails.config.livongo.authorizeUri

    var data = {
      username: credentials.username,
      password: credentials.password,
    }

    var headers = {
      'Content-Type' : 'application/json'
    }

    var options = {
      url: url,
      headers: headers,
      form: data
    }

    request.post(options, function(err,httpResponse,body){
      var json = JSON.parse(body)
      var accessToken  = json.access_token
      var refreshToken = json.refresh_token
      sails.config.globals.livongo.accessToken  = accessToken
      sails.config.globals.livongo.refreshToken = refreshToken
    })

  },

  getReadings: function(start, end, cb) {
    var url = sails.config.livongo.readingsUri + "?start=" + start + "&end=" + end + "&tagsIsControl=false&tagsSource=1,11"

    var headers = {
      'Authorization': 'Bearer ' + sails.config.globals.livongo.accessToken
    }

    var options = {
      url: url,
      headers: headers
    }

    request.get(options, function(err,httpResponse,body){
      var data = JSON.parse(body)
      cb(data, null)
    })
  }
}
