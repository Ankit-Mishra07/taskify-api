const { createTask, getAllTasksList, updateTask, getOneTask, deleteOneTask } = require('../controller/task.controller');
const { verifyToken, isAdmin } = require('../middleware/auth-middleware');

const taskRouter = require('express').Router();

taskRouter.route('/create').post(verifyToken, isAdmin, createTask);
taskRouter.route('/update/:taskId').patch(verifyToken, updateTask)
taskRouter.route('/getallTasks').get(verifyToken, getAllTasksList);
taskRouter.route('/getonetask/:id').get(verifyToken, getOneTask);
taskRouter.route('/delete/:id').delete(verifyToken, isAdmin, deleteOneTask)


module.exports = taskRouter;