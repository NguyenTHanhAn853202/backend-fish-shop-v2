const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BillSChema = new Schema({
    billId:{type: String,required:true},
    provider:{type: String,required: true},
    date: {type: String},
    createdAt:{type: Date,default: Date.now},
})


module.exports =  mongoose.model('Bill', BillSChema)