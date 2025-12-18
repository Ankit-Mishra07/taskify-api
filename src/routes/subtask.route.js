const { createSubtask, updateSubtask, getOneSubTask, deleteOneSubTask } = require('../controller/subtask.controller');
const { verifyToken } = require('../middleware/auth-middleware');

const subtaskRouter = require('express').Router();

subtaskRouter.route('/create/:taskId').post(verifyToken, createSubtask);
subtaskRouter.route('/update/:subtaskId').patch(verifyToken, updateSubtask);
subtaskRouter.route('/getonesubtask/:id').get(verifyToken, getOneSubTask);
subtaskRouter.route('/deletesubtask/:id').delete(verifyToken, deleteOneSubTask)
module.exports = subtaskRouter;