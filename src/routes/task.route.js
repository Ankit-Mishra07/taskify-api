const { createTask, getAllTasksList, updateTask, getOneTask, deleteOneTask, getSingleUserTaskLists, getAllTask_SubTaskList, searchTaskByText } = require('../controller/task.controller');
const { verifyToken, isAdmin } = require('../middleware/auth-middleware');

const taskRouter = require('express').Router();

taskRouter.route('/create').post(verifyToken, isAdmin, createTask);
taskRouter.route('/update/:taskId').patch(verifyToken, updateTask)
taskRouter.route('/getallTasks').get(verifyToken, getAllTasksList);
taskRouter.route('/getonetask/:id').get(verifyToken, getOneTask);
taskRouter.route('/delete/:id').delete(verifyToken, isAdmin, deleteOneTask)
taskRouter.route('/getusertasklist/:userId').get(verifyToken, getSingleUserTaskLists)
taskRouter.route('/gettasksubtasklist').get(verifyToken, getAllTask_SubTaskList)
taskRouter.route('/searchtask').get(verifyToken, searchTaskByText)

module.exports = taskRouter;