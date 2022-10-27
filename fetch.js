require('dotenv').config()

const fetch = require('node-fetch')

const subscriptionNameOrId = 'projects/email-to-sms-360208/subscriptions/email-to-sms';

const serverUrl = "http://email-to-sms.herokuapp.com"

// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub')

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

function listenForMessages() {
    console.log('Listening')
    fetch(serverUrl)
        // References an existing subscription
    const subscription = pubSubClient.subscription(subscriptionNameOrId);

    // Create an event handler to handle messages
    const messageHandler = message => {
        console.log(`Received message ${message.id}:`);
        console.log(`\tData: ${message.data}`);
        console.log(`\tAttributes: ${message.attributes}`);

        fetch(serverUrl)

        // "Ack" (acknowledge receipt of) the message
        message.ack();
    };

    // Listen for new messages
    subscription.on('message', messageHandler);
}

module.exports = listenForMessages;
