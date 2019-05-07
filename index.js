
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const admin = require("firebase-admin");
const serviceAccount = require('./pureartisanapp-firebase-adminsdk.json');
app.use(bodyParser())
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pureartisanapp.firebaseio.com"
});


app.post('/api/sendNotification',(req,res)=>{
    let data = req.body
    const message={
        notification: {
            body: data.notification.message,
            title: data.notification.fName
          },
          tokens:data.tokens
    }
    admin.messaging().sendMulticast(message)
  .then((response) => {
    // Response is a message ID string.
    res.json({message:'Success'})
    if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(data.tokens[idx]);
          }
        });
        console.log('List of tokens that caused failures: ' + failedTokens);
      }
  })
})
app.listen('4000',()=>console.log('listening on port 4000'))