const { trusted } = require("mongoose");
const TaskSchema = require("../model/task.model");
const { WorkLogSchema } = require("../model/worklog.model")
const { isValidDate } = require("../utils/common");
const { SubTaskSchema } = require("../model/subtask.model");

const createworkLog = async (req, res) => {
    try {
        if(!isValidDate(req.body.dateTime)) {
            return res.status(401).json({
            success: false, message: 'Invalid Date & Time',
            })
        }

        const isTaskExist = await TaskSchema.findById(req.params.taskId);
        if(!isTaskExist) {
            return res.status(200).json({
                success: false, message: 'Task does not exist',
            })    
        }
        const workLog = await WorkLogSchema.create({
            dateTime: req.body.dateTime,
            description: req.body.description,
            userId: req.params.userId,
            taskId: req.params.taskId,
            timeSpent: req.body.timeSpent
        });
        const allWorkLogs = await WorkLogSchema.find({taskId: req.params.taskId}).populate(['taskId', 'userId']);
        const taskWork = {
            "workLogs": allWorkLogs
        }
        const updateTask = await TaskSchema.findByIdAndUpdate(req.params.taskId, taskWork, {new: true, runValidators:true});

        return res.status(200).json({
            success: true, message: 'Worklog added successfully',
            data: allWorkLogs
        })  
    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        })  
    }
}

const updateWorkLog = async (req, res) => {
    try {

        const findCurrentLog = await WorkLogSchema.findById(req.params.worklogId);
        if(req.body.dateTime && !isValidDate(req.body.dateTime)) {
            return res.status(401).json({
                success: false, message: 'Invalid Date & Time',
            })
        }
        let taskTypeExists = 'parenttask';
        let isTaskExist = await TaskSchema.findById(findCurrentLog.taskId);
        if(!isTaskExist) {
            taskTypeExists = 'subtask';
            isTaskExist = await SubTaskSchema.findById(findCurrentLog.taskId)
        }
        if(!isTaskExist) {
            return res.status(200).json({
                success: false, message: 'Task does not exist',
            })    
        }

        const workLogUpdate = await WorkLogSchema.findByIdAndUpdate(req.params.worklogId, req.body, {new:true, runValidators:true});
        isTaskExist.workLogs.forEach(v=> {
            if(v._id == workLogUpdate._id) {
                v = {...workLogUpdate}
            }
        })
        if(taskTypeExists == 'parenttask') {
            await TaskSchema.findByIdAndUpdate(req.params.taskId, isTaskExist, {new: true, runValidators:true});
        }else if(taskTypeExists == 'subtask') {
            await SubTaskSchema.findByIdAndUpdate(req.params.taskId, isTaskExist, {new: true, runValidators:true}); 
        }
        const allWorkLogs = await WorkLogSchema.find({taskId: findCurrentLog.taskId}).populate(['taskId', 'userId']);
        return res.status(200).json({
            success: true, message: 'Worklog updated successfully',
            data: allWorkLogs
        }) 

    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        })     
    }
}

const getAllWorkLogForSingleUser = async (req, res) => {
    try {
        const worklogForUser = await WorkLogSchema.find({userId: req.params.userId});
        return res.status(200).json({
            success: true, message: 'Worklog fetched successfully',
            data: worklogForUser
        }) 

    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        });
    }
}

const deleteWorkLog = async (req, res) => {
    try {
        const worklog = await WorkLogSchema.findByIdAndDelete(req.params.id);

        let taskTypeExists = 'parenttask';
        let isTaskExist = await TaskSchema.findById(worklog.taskId);
        if(!isTaskExist) {
            taskTypeExists = 'subtask';
            isTaskExist = await SubTaskSchema.findById(worklog.taskId)
        }

        if(!isTaskExist) {
            return res.status(500).json({
                success: false, message: 'Something went wrong',
                errorMessage: error,
            });  
        }

        isTaskExist.workLogs = isTaskExist.workLogs.filter(v => v._id !== req.params.id);

        if(taskTypeExists == 'parenttask') {
            await TaskSchema.findByIdAndUpdate(req.params.taskId, isTaskExist, {new: true, runValidators:true});
        }else if(taskTypeExists == 'subtask') {
            await SubTaskSchema.findByIdAndUpdate(req.params.taskId, isTaskExist, {new: true, runValidators:true}); 
        }
        return res.status(500).json({
            success: false, message: 'Work Log Deleted Successfully',
        }); 
        

    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        }); 
    }
}

module.exports = {createworkLog, updateWorkLog, getAllWorkLogForSingleUser, deleteWorkLog}