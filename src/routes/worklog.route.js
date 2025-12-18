const { createworkLog, updateWorkLog, getAllWorkLogForSingleUser, deleteWorkLog } = require('../controller/worklog.controller');
const { verifyToken } = require('../middleware/auth-middleware');

const worklogRouter = require('express').Router();

worklogRouter.route('/createlog/:userId/:taskId').post(verifyToken ,createworkLog);
worklogRouter.route('/updatelog/:worklogId').patch(verifyToken ,updateWorkLog);
worklogRouter.route('/getAllWorkLogForSingleUser/:userId').get(verifyToken ,getAllWorkLogForSingleUser);
worklogRouter.route('/deletelog/:id').delete(verifyToken, deleteWorkLog);

module.exports = worklogRouter; 