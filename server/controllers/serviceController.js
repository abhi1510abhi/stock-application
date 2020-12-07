
const Customer = require('../models/customer');
const Usercredentials = require("../models/usercredentials");
const logger = require('pino')();
const moment = require('moment');
const jwt = require('jsonwebtoken');

/**
 * customerInfo api is used for getting customer data
 */

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

/**
 * Login api used to check credentials
 */


const login = async (req, res) => {
    try {
        logger.info(`Inside Login controller`);
        const { username = "", password = "" } = req.body;
        if (username && password) {
            let authToken = "";
            jwt.sign({
                username,
                password
            }, process.env.JWT_SECRET, (err, token) => {
                authToken = token;
            })
            const data = await Usercredentials.find({
                customerId: username,
                password
            }).lean();
            if (data.length == 1) {
                return res.status(200).json({ status: true, customerId: username, authToken });
            }
        }
        return res.status(500).json({ status: false, customerId: "", authToken: "" });
    } catch (e) {
        logger.error(`error while calling Login api ${e.message}`);
        return res.status(500).json({ status: false, customerId: "", authToken: "" })
    }
}

/**
 * buy api is used for executing buy in stock market
 */

const buy = async (req, res) => {
    try {
        logger.info(`Inside buy controller`);
        const { customerId, stockId, requestedShare, currentVal, stockName } = req.body

        const holdings = {
            stockId,
            value: currentVal,
            shares: Number(requestedShare),
            action: "buy",
            stockName,
            createdAt: moment.utc().toDate()
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

/**
 * sell api is used for executing sell in stock market
 */

const sell = async (req, res) => {
    logger.info(`Inside sell controller`);
    try {
        const { customerId, stockId, requestedShare, currentVal, stockName } = req.body

        const holdings = {
            stockId,
            stockName,
            value: currentVal,
            shares: requestedShare,
            action: "sell",
            createdAt: moment.utc().toDate()
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
    login,
    buy,
    sell
}