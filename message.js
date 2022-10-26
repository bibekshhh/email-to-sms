var axios = require('axios');
var data = JSON.stringify({
    "messaging_product": "whatsapp",
    "recipient_type": "individual",

    "to": "<Receiver Number>",

    "type": "text",
    "text": {
        "preview_url": false,
        "body": "sab thik xa"
    }
});

var config = {
    method: 'post',
    url: 'https://graph.facebook.com/v13.0/<your facebook cloud id>/messages',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Beared <your auth token>'

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
