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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.get('/', function(req, res){
    res.render('frontend.html',  {'Content-type' : 'text/css'});
});

app.post('/addToBlacklist', function(req, res){
    console.log(req.body.addFilterWord);
    addToBlacklist(req.body.addFilterWord);

    returnKeyWord('awlfhnlaehnlawef my_word');

});


app.post('/getBlacklist', )
function getBlacklist(){
    wp.getBlacklist()
    .then(blacklist => {
        for (word in blacklist) {
            console.log(blacklist[word]);
        }
    });
}



function addToBlacklist(req){
    wp.addToBlacklist(req)
    .then(success => {
      if (success) { console.log('success!');}
    });
}

function removeFromBlacklist(req){
    wp.removeFromBlacklist(req)
    .then(success => {
      if (success) { console.log('success!'); }
    });
}

function returnKeyWord(req){
    wp.return(req)
    .then(profanity => {
        for (word in profanity) {
            console.log(profanity[word]);
        }
    });
}

var server = app.listen(5000, function(){
    console.log("connecting server using port 5000");
})