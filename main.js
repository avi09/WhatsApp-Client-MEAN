var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var datetime = new Date();
var bodyParser = require("body-parser") 
var fs = require('fs');

app.use(express.static('./'))
app.use(cookieParser());
app.use(session({secret:"Cookie Usage"}));

const accountSid = 'AC1b94d94dd03d0bd778a1afd8c0959ef6';
const authToken = 'f475e5cbabc598ada7e38f321661063e';

var mynumber='+918989759279';

const client = require('twilio')(accountSid, authToken);
app.use(bodyParser.urlencoded({ 
    extended:true
})); 

app.get('/', function (req, res) {

	client.messages('SMb13874b78b579fb60e16b9dbc928e5cb').fetch().then(message => console.log(message.body.split('\n')[0]));
	req.session.auth=-1    
	res.sendFile(path.join(__dirname+'/test.html'));
})

app.get('/connected', function (req, res) {
    if (req.param('authid')==accountSid && req.param('authcode')==authToken)
    {
    	req.session.auth = 1
   	res.sendFile(path.join(__dirname+'/test1.html'));
    }
    if (req.session.auth==1)
    {
    	req.session.auth=1
    	res.sendFile(path.join(__dirname+'/test1.html'))
    }
})

app.get('/connected/message', function(req, res){
   	if (req.session.auth==1)
   	{
	console.log(req.param('messag'))
	client.messages
	.create({
	 from: 'whatsapp:+14155238886',
	 body: req.param('messag'),
	 to: 'whatsapp:'+mynumber
	})
	.then(message => console.log(message.sid));
	var history = require('./data.json');
	var datetime = new Date();
	let nm = {type:'sent', time:datetime, message:req.param('messag'), color:'blue'};
	history.push(nm);
	fs.writeFile('data.json', JSON.stringify(history), err => { if (err) throw err; });
	
	res.redirect('/connected')
	}	
})

app.post('/connected/received', function(req,res){
	message1 = req.param('Body');
	console.log(message1)
	var history = require('./data.json');
	var datetime = new Date();
	let nm = {type:'received', time:datetime, message:message1, color:'green'};
	history.push(nm);
	fs.writeFile('data.json', JSON.stringify(history), err => { if (err) throw err; });
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

