

const Listing = require('../models/listing');

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
        console.log(e.message);
    }
}

module.exports = {
    stockCurrentValue
}