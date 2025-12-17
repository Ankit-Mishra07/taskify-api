const { createTask, getAllTasksList, updateTask } = require('../controller/task.controller');

const taskRouter = require('express').Router();

taskRouter.route('/create').post(createTask);
taskRouter.route('/update/:taskId').patch(updateTask)
taskRouter.route('/getallTasks').get(getAllTasksList);



module.exports = taskRouter;