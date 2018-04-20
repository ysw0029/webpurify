var express = require('express');
var bodyParser = require('body-parser');
const WebPurify = require('webpurify');
var io = require('socket.io-client');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var socket = io.connect('http://localhost:7777');

const wp = new WebPurify({
    api_key:'2875199a8ef09c44a0a2c4cafaf270ca'
    //, endpoint:   'us'  // Optional, available choices: 'eu', 'ap'. Default: 'us'.
    //, enterprise: true // Optional, set to true if you are using the enterprise API, allows SSL
});
var app = express();


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


socket.on('connect', function(data) {
    socket.emit('join', 'Hello server from client');
});

app.get('/frontend', function(req, res){
    res.render('frontend.html');
});

app.get('/',function(req, res){
    res.render('form.html');
    //socket.emit('message', 'Send message from client');

});

app.post('/return',function(req, res){
    console.log(req.body.data);
    returnKeyWord(req.body.data);
    //socket.emit('messages', 'Send message from client');
});

app.post('/addToBlacklist', function(req, res){
    console.log(req.body.addFilterWord);
    addToBlacklist(req.body.addFilterWord);

    returnKeyWord('awlfhnlaehnlawef my_word');

});


app.post('/getBlacklist', function(req, res){
    var list = getBlacklist();
   // console.log(list[]);
    res.send(list);
});
function getBlacklist(){
    var list=[];
    wp.getBlacklist()
    .then(blacklist => {
        for (word in blacklist) {
            console.log(blacklist[word]);
            list.push(blacklist[word]);
        }
    });
    console.log(list);

    return list;
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