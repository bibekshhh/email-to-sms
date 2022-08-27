const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
    mailId: {
        type: String
    },
    mailData: {
        type: String
    }
});

module.exports = mongoose.model("mail", mailSchema);