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

const accountSid = '';
const authToken = '';

var mynumber='+9';

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
	let nm = {type:'sent', time:datetime, message:req.param('messag'), color:'#2853a8'};
	history.push(nm);
	fs.writeFile('data.json', JSON.stringify(history), err => { if (err) throw err; });
	
	res.redirect('/connected')
	}	
})

app.post('/connected/received', async function(req,res){
	count=0;
	var message1 = req.body['MessageSid'];
	console.log(message1);
	var response = await client.messages(message1).fetch();
	var x = await response;
	var mg = x['body'].split('\n')[0].substr(10,);
	mg = mg.slice(0, -1);
	console.log(mg);
	var history = require('./data.json');
	var datetime = new Date();
	let nm = {type:'received', time:datetime, message:mg, color:'#4cb518'};
	if (count==0 && mg.length>=1)
	{
		count=1;
		history.push(nm);
		fs.writeFile('data.json', JSON.stringify(history), err => { if (err) throw err; });
	}
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

