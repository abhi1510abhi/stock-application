
const Customer = require('../models/customer');

const customerInfo = async (req, res) => {
    try {
        const { customerId } = req.params;
        const customerData = await Customer.findOne({
            customerId
        }).lean();
        return res.status(200).json({ status: true, customerData });
    } catch (e) {
        //logging the error
        console.log(e.message);
        //returning data with 500 error code
        return res.status(500).json({ status: false, customerData: {} })
    }
}

const buy = async (req, res) => {
    try {
        console.log("inside")
        const { customerId, stockId, requestedShare, currentVal, stockName } = req.body

        const holdings = {
            stockId,
            value: currentVal,
            shares: Number(requestedShare),
            action: "buy",
            stockName
        }

        const customerData = await Customer.findOneAndUpdate({
            customerId
        }, {
            "$addToSet": {
                holdings
            }
        }, { new: true }) || {}

        return res.status(200).json({ status: true, message: "requested has been submitted", customerData })

    } catch (e) {
        return res.status(500).json({ status: false, message: "unable to proceed with your order! :C", customerData: {} })
    }
}
const sell = async (req, res) => {

    try {
        const { customerId, stockId, requestedShare, currentVal, stockName } = req.body

        const holdings = {
            stockId,
            stockName,
            value: currentVal,
            shares: requestedShare,
            action: "sell"
        }

        const customerData = await Customer.findOneAndUpdate({
            customerId
        }, {
            "$addToSet": {
                holdings
            }
        }, { new: true }) || {}

        return res.status(200).json({ status: true, message: "requested has been submitted", customerData })

    } catch (e) {
        return res.status(500).json({ status: false, message: "unable to proceed with your order! :C", customerData: {} })
    }

}


module.exports = {
    customerInfo,
    buy,
    sell
}