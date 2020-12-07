const mongoose = require('mongoose');

/**
 * Customer schema to store customer details
 */

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
        action: String,
        createdAt: Date
    }]
}, {
    collection: 'customers',
    timestamps: true
});

module.exports = mongoose.model('customers', CustomerSchema);