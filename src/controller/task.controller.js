const TaskSchema = require("../model/task.model")
const uuid = require('uuid');

const createTask = async (req, res) => {
    try {
        const uniqueTaskId = uuid.v4();
        const task = await TaskSchema.create({
                taskId: uniqueTaskId,
                projectName: req.body.projectName,
                workType: req.body.workType,
                status: req.body.status || 'Todo',
                summary: req.body.summary,
                description: req.body.description,
                createdBy: req.body.createdBy,
                priority: req.body.priority || 'Medium',
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                dueDate: req.body.dueDate,
                assignedTo: req.body.assignedTo,
                reporter: req.body.reporter,
                userId: req.body.userId,
                subTasks: [],
                workLogs: [],
        });
        const getTask = await TaskSchema.find({taskId: uniqueTaskId}).populate(["assignedTo", "reporter", "createdBy"], ['-password', '-createdAt', '-updatedAt']);

        return res.status(200).json({
            success: true, message: 'Task Created Successfully', 
            data: getTask
        })


    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        })
    }
}

updateTask = async (req, res) => {
    try {
        let task = await TaskSchema.findById(req.params.taskId);
        if(!task) {
            return res.status(404).json({
                success:false, message: 'Task not found!'
            })
        }
        task = await TaskSchema.findByIdAndUpdate(req.params.taskId, req.body, {new: true, runValidators:true}).populate(["assignedTo", "reporter", "createdBy"], ['-password', '-createdAt', '-updatedAt']);
        return res.status(200).json({
            success:true, message: 'Task updated successfully',
            data: task
        })
    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        })
    }
}

const getAllTasksList = async (req, res) => {
    try {
        const tasks = await TaskSchema.find().populate(["assignedTo", "reporter", "createdBy"], ['-password', '-createdAt', '-updatedAt'])
        return res.status(200).json({
            success: true, message: 'Task Fetched Successfully', 
            data: tasks
        })
    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        })  
    }
}

const getOneTask = async (req, res) => {
    try {
        const tasks = await TaskSchema.findById(req.params.id).populate(["assignedTo", "reporter", "createdBy"], ['-password', '-createdAt', '-updatedAt'])
        return res.status(200).json({
            success: true, message: 'Task Fetched Successfully', 
            data: tasks
        })
    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        })        
    }
}

const deleteOneTask = async (req, res) => {
    try {
        await TaskSchema.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success: true, message: 'Task Updated Successfully', 
        })
    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        })        
    }
}

module.exports = {createTask, getAllTasksList, updateTask, getOneTask, deleteOneTask};