// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'AC1b94d94dd03d0bd778a1afd8c0959ef6';
const authToken = 'f475e5cbabc598ada7e38f321661063e';
const client = require('twilio')(accountSid, authToken);

client.messages
      .create({
         from: 'whatsapp:+14155238886',
         body: 'Hi',
         to: 'whatsapp:+918989759279'
       })
      .then(message => console.log(message.sid));
