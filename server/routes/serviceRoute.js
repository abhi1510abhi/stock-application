const express = require('express');
const serviceRouter = express.Router();

const controller = require('../controllers/serviceController');

/**
 * Router section to route serviceController
 */

serviceRouter.get('/customer-info/:customerId', controller.customerInfo);
serviceRouter.post('/buy', controller.buy);
serviceRouter.post('/sell', controller.sell);


module.exports = serviceRouter;