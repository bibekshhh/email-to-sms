const myFunctions = require('./utils');
const fetchFunction = require('./fetch');
const express = require('express')

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
    const mailToSearch = "bibekshh1@gmail.com";

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
                mailData: item.data
            });

            newMail.save((error, data) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log("Data inserted successfully.")
                }
            });

            client.messages
                .create({
                    body: parseInboxData[0].data,
                    from: 'whatsapp:+14155238886',
                    to: 'whatsapp:+9779827314543'
                })
                .then(message => {
                    console.log("Message sent to whatsapp!")
                    console.log(message.sid)
                })
                .done();
        }
    };

    parseInboxData.forEach(saveMail);
    res.send("done")
});


app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})