const { trusted } = require("mongoose");
const TaskSchema = require("../model/task.model");
const { WorkLogSchema } = require("../model/worklog.model")
const { isValidDate } = require("../utils/common")

const createworkLog = async (req, res) => {
    try {
        if(!isValidDate(req.body.dateTime)) {
            return res.status(401).json({
            success: false, message: 'Invalid Date & Time',
            })
        }

        const isTaskExist = await TaskSchema.findOne({taskId: req.params.taskId});
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
            "workLogs": [...allWorkLogs]
        }
        await TaskSchema.findByIdAndUpdate(req.params.taskId, taskWork, {new: true, runValidators:trusted});

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

module.exports = {createworkLog}