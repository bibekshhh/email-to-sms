const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

if(!MONGO_URI) {
    console.log("MONGO URI not found. Application Shutting down")
    process.exit(1)
    return
}

exports.connect = () => {
    mongoose
        .connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log("Database Connected Successfully !!")
        })
        .catch(error => {
            console.log("Database Connection Failed !!")
            console.log(error)
            process.exit(1)
        })
}
