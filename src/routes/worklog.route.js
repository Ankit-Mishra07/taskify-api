const { createworkLog } = require('../controller/worklog.controller');
const { verifyToken } = require('../middleware/auth-middleware');

const worklogRouter = require('express').Router();

worklogRouter.route('/createlog/:userId/:taskId').post(verifyToken ,createworkLog);

module.exports = worklogRouter;