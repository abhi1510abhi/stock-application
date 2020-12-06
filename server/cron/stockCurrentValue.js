

const Listing = require('../models/listing');
const logger = require('pino')();

/**
 * This cron job is used to get the updated data  every 4 sec and pass it to client using socket connection
 */

const stockCurrentValue = async () => {

    try {
        const data = await Listing.find({
            "stockId": { "$exists": true }
        }).lean() || [];

        const realTimeData = data.map(ele => {
            return {
                stockId: ele.stockId,
                stockName: ele.stockName,
                totalHoldings: ele.totalHoldings,
                currentVal: ele.currentVal + Math.floor(Math.random() * 10)  // just to see fluctuation in UI
            }
        })

        return realTimeData || [];
    } catch (e) {
        logger.error(`Error while running cron job ${e.message}`);
    }
}

module.exports = {
    stockCurrentValue
}