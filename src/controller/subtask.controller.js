const { SubTaskSchema } = require("../model/subtask.model");
const TaskSchema = require("../model/task.model");

const createSubtask = async (req, res) => {
    try {
        const parentTask = await TaskSchema.findById(req.params.taskId);
        console.log(parentTask)
        if(parentTask) {
            const subtaskCreate = await SubTaskSchema.create({
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
                taskId: req.body.taskId,
                workLogs: [],

            });
            parentTask.subTasks = [...parentTask.subTasks, subtaskCreate]
            await TaskSchema.findByIdAndUpdate(req.params.taskId, parentTask, {new: true, runValidators:true});

            return res.status(200).json({
                success:true, message: 'Subtask create succussfully',
                data: subtaskCreate
            })
        }
    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        });
    }
}

const updateSubtask = async (req, res) => {
    try {
        const subtaskUpdate = await SubTaskSchema.findByIdAndUpdate(req.params.subtaskId, req.body, {new:true, runValidators:true});
        const parentTask = await TaskSchema.findById(subtaskUpdate.taskId);
        console.log(subtaskUpdate);
        console.log('-------------------');
        console.log(parentTask);
    
        parentTask.subTasks.forEach(v => {
            if(v._id == subtaskUpdate._id) {
                v = {...subtaskUpdate};
            }
        });
        await TaskSchema.findByIdAndUpdate(subtaskUpdate.taskId, parentTask, {new: true, runValidators:true});
        return res.status(200).json({
            success:true, message: 'Subtask updated succussfully',
            data: subtaskUpdate
        })

    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        });
    }
}

const getOneSubTask = async (req, res) => {
    try {
        const subTask = await SubTaskSchema.findById(req.params.id).populate(["assignedTo", "reporter", "createdBy"], ['-password', '-createdAt', '-updatedAt'])
        return res.status(200).json({
            success: true, message: 'Task Fetched Successfully', 
            data: subTask
        })
    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        });     
    }
}

const deleteOneSubTask = async (req, res) => {
    try {
        await SubTaskSchema.findByIdAndDelete(req.params.id);
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
module.exports = {createSubtask, updateSubtask, getOneSubTask, deleteOneSubTask}