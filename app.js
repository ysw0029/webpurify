var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.get('/', function(req, res){
    res.render('frontend.html',  {'Content-type' : 'text/css'});
});
var server = app.listen(5000, function(){
    console.log("connecting server using port 5000");
  })