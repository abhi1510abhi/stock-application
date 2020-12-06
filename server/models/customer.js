const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
    customerId: { type: String, require: true },
    name: String,
    dmatStatus: String,
    wishlist: [{
        stockId: String
    }],
    holdings: [{
        stockId: String,
        stockName: String,
        value: Number,
        shares: Number,
        action: String
    }]
});

module.exports = mongoose.model('customers', CustomerSchema);