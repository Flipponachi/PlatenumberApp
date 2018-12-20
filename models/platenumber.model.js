const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlateNumberSchema = new Schema({
    number: {
        type: String,
        unique: true,
        require: true
    },
    lga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LocalGoverment'
    },
    creationTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PlateNumber', PlateNumberSchema);