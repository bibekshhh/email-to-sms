const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
    mailId: {
        type: String,
        required: true
    },
    mailData: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("mail", mailSchema);
