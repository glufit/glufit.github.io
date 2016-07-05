var express = require('express');
var app     = express();

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error


var renderIndex = (req: express.Request, res: express.Response) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
}

app.get('/', function(request, response) {
  response.send("index.html");
}).listen(app.get('port'), function() {
  console.log('App is running, server is listening on port ', app.get('port'));
});
