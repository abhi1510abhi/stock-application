const mongoose = require('mongoose');

/**
 * Schema to store user login credentials
 */

const UserCredentialSchema = mongoose.Schema({
    customerId: { type: String, require: true },
    password: String,
    status: String   //Active or Inactive
}, {
    collection: 'usercredentials',
    timestamps: true
});

module.exports = mongoose.model('usercredentials', UserCredentialSchema);

