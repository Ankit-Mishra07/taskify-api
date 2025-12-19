const { getStattusList, createStattus, updateStattusList } = require('../controller/status.controller');
const { verifyToken, isAdmin } = require('../middleware/auth-middleware');

const statusRouter = require('express').Router();

statusRouter.route('/statuslist').get(verifyToken, getStattusList);
statusRouter.route('/updatestatus').patch(verifyToken, isAdmin, updateStattusList);
statusRouter.route('/createstatus').post(verifyToken,isAdmin, createStattus);

module.exports = statusRouter;