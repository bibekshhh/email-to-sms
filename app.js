const myFunctions = require('./utils');
const fetchFunction = require('./fetch');
const express = require('express')
var axios = require('axios');

require('dotenv').config();
require('./config/database').connect();
fetchFunction()

// importing user model
const Mail = require('./model/data')

//importing twilio
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);

//creating an express server
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());

app.route('/').get(async(req, res) => {
    const mailToSearch = "newer_than:2d";

    const parseInboxData = await main();
    async function main() {
        const token = await myFunctions.getAccessToken();

        const message_id = await myFunctions.searchGmail(token, mailToSearch);
        const readGmailContentData = await myFunctions.readGmailContent(token, message_id);

        const inboxData = await myFunctions.readInboxContent(readGmailContentData);

        myFunctions.watchMyLabel(token)
        return inboxData
    }

    console.log(parseInboxData)

    const saveMail = async(item, index) => {

        if ((typeof item !== 'undefined') || (item !== null)) {
            // check if mail already exists in database
            const oldMail = await Mail.findOne({ mailId: item.id });

            if (oldMail) {
                console.log("Mail already saved")
                return
            }

            var newMail = new Mail({
                mailId: item.id,
                mailData: item.data,
                sender: item.sentBy
            });

            newMail.save((error, data) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log("Data inserted successfully.")
                }
            });

            var whatsappMsg = `Sender: ${item.sentBy}\nMessage: ${item.data}`;

            var data = JSON.stringify({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": "9779827314543",
                "type": "text",
                "text": {
                    "preview_url": false,
                    "body": whatsappMsg
                }
            });

            var config = {
                method: 'post',
                url: 'https://graph.facebook.com/v13.0/101709939348365/messages',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.messageId}`
                },
                data: data
            };

            axios(config)
                .then(function(response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function(error) {
                    console.log(error);
                });

            // client.messages
            //     .create({
            //         body: whatsappMsg,
            //         from: 'whatsapp:+14155238886',
            //         to: 'whatsapp:+9779827314543'
            //     })
            //     .then(message => {
            //         console.log("Message sent to whatsapp!")
            //         console.log(message.sid)
            //     })
            //     .done();
        }
    };

    parseInboxData.forEach(saveMail);
    res.send("done")
});


app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})