const mongoose = require('mongoose');

const ListingSchema = mongoose.Schema({
    stockId: { type: String, require: true },
    stockName: String,
    currentVal: Number,
    totalHoldings: String
});

module.exports = mongoose.model('listings', ListingSchema);

