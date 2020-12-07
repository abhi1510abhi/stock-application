const mongoose = require('mongoose');

/**
 * Schema to list all stock market
 */

const ListingSchema = mongoose.Schema({
    stockId: { type: String, require: true },
    stockName: String,
    currentVal: Number,
    totalHoldings: String
}, {
    collection: 'listings',
    timestamps: true
});

module.exports = mongoose.model('listings', ListingSchema);

