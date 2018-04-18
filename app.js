var express = require('express');
var bodyParser = require('body-parser');
const WebPurify = require('webpurify');
const wp = new WebPurify({
    api_key: '02bd844833e5a5f1fc15ebb1fbd196f5'
    //, endpoint:   'us'  // Optional, available choices: 'eu', 'ap'. Default: 'us'.
    , enterprise: true // Optional, set to true if you are using the enterprise API, allows SSL
});
var app = express();

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.get('/', function(req, res){
    res.render('frontend.html',  {'Content-type' : 'text/css'});
});

app.use(function(req, res){
    wp.addToBlacklist('my_word')
    .then(success => {
      if (success) { console.log('success!'); list();}
    });
});

function list(){
    wp.getBlacklist()
     .then(blacklist => {
        for (word in blacklist) {
    console.log(blacklist[word]);
  }
});
}
var server = app.listen(5000, function(){
    console.log("connecting server using port 5000");
})