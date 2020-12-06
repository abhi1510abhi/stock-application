const mongoose = require('mongoose');

const WalletSchema = mongoose.Schema({
    customerId: { type: String, require: true },
    amount: { type: Number, default: 0 },
    transactionHistory: [{
        stockId: String
    }]
});

module.exports = mongoose.model('wallet', WalletSchema);