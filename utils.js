const axios = require('axios');
const { read } = require('fs');
const qs = require('qs');

async function getAccessToken() {
    var data = qs.stringify({
        'client_id': '',
        'client_secret': '',
        'refresh_token': '',
        'grant_type': ''
    });
    var config = {
        method: 'post',
        url: 'https://accounts.google.com/o/oauth2/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };
    var access_token = "";

    await axios(config)
        .then(async function(response) {
            access_token = await JSON.stringify(response.data.access_token);
        })
        .catch(function(error) {
            console.log(error);
        });

    console.log(access_token)
    return access_token;
}

async function searchGmail(token, searchMailParam) {
    var config = {
        method: 'get',
        url: 'https://www.googleapis.com/gmail/v1/users/me/messages?q=' + searchMailParam,
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    var msg_id = [];
    await axios(config)
        .then(async function(response) {
            await (response.data["messages"]).forEach((item, index) => {
                msg_id.push(item.id)
            });
        })
        .catch(function(error) {
            console.log(error);
        });

    return msg_id;
};

async function readGmailContent(token, message_id) {
    const data = [];

    for (let i = 0; i < message_id.length; i++) {
        const config = {
            method: 'get',
            url: `https://www.googleapis.com/gmail/v1/users/me/messages/${message_id[i]}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        await axios(config)
            .then(async function(response) {
                data.push(await response.data);
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    return data;
}

async function readInboxContent(searchText) {
    const messageArr = [];
    const message = await searchText;
    const item = message[0];

    var sentBy = "";
    const headers = item.payload.headers;

    headers.forEach(data => {
        if (data.name == "From") {
            const sender = data.value;
            var match = sender.slice(sender.lastIndexOf(' '));
            sentBy = match
        }
    })

    const encodedMessage = item.payload.body.data || item.payload["parts"][0].body.data;

    if (typeof encodedMessage !== 'undefined') {
        const decodedMessage = Buffer.from(encodedMessage, "base64").toString('utf-8').replace(/\n|\r/g, "");
        messageArr.push({ id: item.id, data: decodedMessage, sentBy: sentBy })
    }

    return messageArr
}

async function watchMyLabel(token) {
    var data = JSON.stringify({
        "topicName": "projects/email-to-sms-360208/topics/email-to-sms",
        "labelIds": [
            "INBOX"
        ]
    });
    var config = {
        method: 'post',
        url: 'https://gmail.googleapis.com/gmail/v1/users/me/watch',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
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
}

module.exports = { getAccessToken, searchGmail, readGmailContent, readInboxContent, watchMyLabel };
