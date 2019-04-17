const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SingerSchema = new Schema({
    name: {
        type:String,
        required: true
    },
    link: String,
    avatar: String
})
const SingerModel = mongoose.model('singer',SingerSchema);
module.exports = { SingerModel }