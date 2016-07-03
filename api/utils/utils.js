var request = require('request');

module.exports = {

  getRequest: function(options, cb) {
    request.get(options, function(err,httpResponse,body){
      if( 400 <= httpResponse.statusCode  && httpResponse.statusCode < 500)
        Fitbit.refresh(function(resp, err) {
          getRequest(options, cb)
        })
      else {
        cb(body, null)
      }
    })
  }

}
