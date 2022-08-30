var axios = require('axios');
var data = JSON.stringify({
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "9779827314543",
    "type": "text",
    "text": {
        "preview_url": false,
        "body": "k xa hau"
    }
});

var config = {
    method: 'post',
    url: 'https://graph.facebook.com/v13.0/101709939348365/messages',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer EAALu3VgEP5QBAMpU8x2yY4X2H5tetCuo1d4bgvhlFOy51HVSKyESLDGNxZArHD5YKDA1x5ZATsrZBWOcJaqMRPbesk5ZBw6zuLI5H0H3MWuw0vb20smce8aZAZAgjMYijjZCHidiMTYZAK5PFRAHWRjbVwj08GqN0mi9Ap66JgFmTpK1JIUD6djX'
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