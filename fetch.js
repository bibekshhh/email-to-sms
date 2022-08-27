require('dotenv').config()

const fetch = require('node-fetch')

const projectId = 'email-to-sms-360208';
const subscriptionNameOrId = 'projects/email-to-sms-360208/subscriptions/email-to-sms';
const timeout = 1;

// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub')

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

function listenForMessages() {
    console.log('Listening')
    fetch('http://localhost:8080')
        // References an existing subscription
    const subscription = pubSubClient.subscription(subscriptionNameOrId);

    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = message => {
        console.log(`Received message ${message.id}:`);
        console.log(`\tData: ${message.data}`);
        console.log(`\tAttributes: ${message.attributes}`);
        messageCount += 1;

        fetch('http://localhost:8080')
            // "Ack" (acknowledge receipt of) the message
        message.ack();
    };

    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);
}

module.exports = listenForMessages;