const mongoose = require('mongoose');
const {MongoClient,BSONType} = require('mongodb')
mongoose.set('strictQuery',true);
async function connect() {

    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/Shop", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('successfully');
    } catch (error) {
        console.log('failure');
    }
}

module.exports = { connect };
