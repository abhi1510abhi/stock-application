const express = require('express');
const serviceRouter = express.Router();

const { jwtVerify } = require('../auth/jwtMiddleware');
const controller = require('../controllers/serviceController');

/**
 * Router section to route serviceController
 */

serviceRouter.get('/customer-info/:customerId', controller.customerInfo);
serviceRouter.post('/register', controller.register);
serviceRouter.post('/login', controller.login);
serviceRouter.post('/buy', jwtVerify, controller.buy);
serviceRouter.post('/sell', jwtVerify, controller.sell);


module.exports = serviceRouter;