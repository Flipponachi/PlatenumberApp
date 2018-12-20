const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocalGovermentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }    
})

module.exports = mongoose.model('LocalGoverment', LocalGovermentSchema);