const { SubTaskSchema } = require("../model/subtask.model");
const TaskSchema = require("../model/task.model")
const { combineSubtaskToTask, generateUUIDId } = require("../utils/common");

const createTask = async (req, res) => {
    try {
        const task = await TaskSchema.create({
                taskUniqueId: generateUUIDId(),
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
        const getTask = await TaskSchema.findById(task._id).populate(["assignedTo", "reporter", "createdBy"], ['-password', '-createdAt', '-updatedAt']);

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

const getSingleUserTaskLists = async (req, res) => {
    try {
        const tasks = await TaskSchema.find({assignedTo: req.params.userId}).populate(["assignedTo", "reporter", "createdBy"], ['-password', '-createdAt', '-updatedAt'])
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
        const tasks = await TaskSchema.findById(req.params.id).populate(["assignedTo", "reporter", "createdBy", "userId"], ['-password', '-createdAt', '-updatedAt'])
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

const getAllTask_SubTaskList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search;
        const { page: p, limit: l, search: s, ...filters } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { summary: { $regex: search, $options: 'i' } },
            ];
        }

        if(filters.assignedTo) {
            query.assignedTo = {$in : filters.assignedTo.split(',').map(d => d.trim())};
        }
        if(filters.workType) {
            query.workType = {$in : filters.workType.split(',').map(d => d.trim())};
        }
        if(filters.status) {
            query.status = {$in : filters.status.split(',').map(d => d.trim())};
        }
        if(filters.projectName) {
            query.projectName = {$in : filters.projectName.split(',').map(d => d.trim())};
        }

        let taskList = await TaskSchema.find(query).populate(["assignedTo", "reporter", "createdBy"], ['-password', '-createdAt', '-updatedAt']);
        let subTaskList = await SubTaskSchema.find(query).populate(["assignedTo", "reporter", "createdBy"], ['-password', '-createdAt', '-updatedAt']);
        let list = taskList.concat(subTaskList).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.status(200).json({
            success: true, message: 'Task fetched Successfully',
            data: list
        })

    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        })         
    }
}

module.exports = {createTask, getAllTasksList, updateTask, getOneTask, deleteOneTask, getSingleUserTaskLists, getAllTask_SubTaskList};