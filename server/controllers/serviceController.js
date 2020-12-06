
const Customer = require('../models/customer');
const logger = require('pino')();

const customerInfo = async (req, res) => {
    try {
        logger.info(`Inside customerInfo controller`);
        const { customerId } = req.params;
        const customerData = await Customer.findOne({
            customerId
        }).lean();
        return res.status(200).json({ status: true, customerData });
    } catch (e) {
        logger.error(`error while calling ${e.message}`);
        return res.status(500).json({ status: false, customerData: {} })
    }
}

const buy = async (req, res) => {
    try {
        logger.info(`Inside buy controller`);
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
        logger.error(`error while calling buy api ${e.message}`);
        return res.status(500).json({ status: false, message: "unable to proceed with your order! :C", customerData: {} })
    }
}
const sell = async (req, res) => {
    logger.info(`Inside sell controller`);
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
        logger.error(`error while calling sell api ${e.message}`);
        return res.status(500).json({ status: false, message: "unable to proceed with your order! :C", customerData: {} })
    }

}


module.exports = {
    customerInfo,
    buy,
    sell
}