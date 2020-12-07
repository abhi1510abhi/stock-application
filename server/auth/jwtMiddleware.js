const jwt = require('jsonwebtoken');
const logger = require('pino')();

/**
 * JWT token validation before calling buy and sell api
 */

const jwtVerify = (req, res, next) => {
    try {
        logger.info("inside JWT middleware");
        const { authorization = "" } = req.headers;
        if (authorization) {
            jwt.verify(authorization, process.env.JWT_SECRET, (err, data) => {
                if (err) {
                    return res.status(403).send({ status: false, message: "Unauthorized access" });
                }
                req.user = data;
                next()
            });

        } else {
            return res.status(403).send({ status: false, message: "Unauthorized access" });
        }
    } catch (e) {
        logger.error(`${e.message}`);
        return res.status(403).send({ status: false, message: "Unauthorized access" });
    }
}

module.exports = {
    jwtVerify
}