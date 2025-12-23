const mongoose = require("mongoose");
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
        let taskTypeExists = 'parenttask';
        let isTaskExist = await TaskSchema.findById(req.params.taskId);
        if(!isTaskExist) {
            taskTypeExists = 'subtask';
            isTaskExist = await SubTaskSchema.findById(req.params.taskId)
        }
        if(!isTaskExist) {
            return res.status(200).json({
                success: false, message: 'Task does not exist',
            });   
        }
        const workLog = await WorkLogSchema.create({
            dateTime: req.body.dateTime,
            description: req.body.description,
            userId: req.params.userId,
            taskId: req.params.taskId,
            timeSpent: req.body.timeSpent
        });
        const allWorkLogs = await WorkLogSchema.find({taskId: req.params.taskId});
        const taskWork = {
            "workLogs": allWorkLogs
        }
        if(taskTypeExists === 'parenttask') {
            await TaskSchema.findByIdAndUpdate(req.params.taskId, taskWork, {new: true, runValidators:true});
        }else if(taskTypeExists === 'subtask') {
            await SubTaskSchema.findByIdAndUpdate(req.params.taskId, taskWork, {new: true, runValidators:true});
        }

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
        console.log(taskTypeExists)
        if(!isTaskExist) {
            return res.status(200).json({
                success: false, message: 'Task does not exist',
            })    
        }

        const workLogUpdate = await WorkLogSchema.findByIdAndUpdate(req.params.worklogId, req.body, {new:true, runValidators:true});
        isTaskExist.workLogs = isTaskExist.workLogs.map((v) => {
            return v._id.toString() === workLogUpdate._id.toString() ? workLogUpdate : v;
        })
        let UpdatedworklogValue = {
            "workLogs": isTaskExist.workLogs
        }
        console.log(isTaskExist.workLogs)
        if(taskTypeExists == 'parenttask') {
            await TaskSchema.findByIdAndUpdate(findCurrentLog.taskId, UpdatedworklogValue, {new: true, runValidators:true});
        }else if(taskTypeExists == 'subtask') {
            await SubTaskSchema.findByIdAndUpdate(findCurrentLog.taskId, UpdatedworklogValue, {new: true, runValidators:true}); 
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

const getFilteredWorkLog = async (req, res) => {
  try {
    const { userId, fromDate, toDate } = req.query;

    const startDate = new Date(fromDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999);

    const worklogs = await WorkLogSchema.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          dateTime: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },

{
  $lookup: {
    from: "tasks",
    let: { taskId: "$taskId" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", "$$taskId"] }
        }
      },
      {
        $unionWith: {
          coll: "subtasks",
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$taskId"] }
              }
            }
          ]
        }
      }
    ],
    as: "task"
  }
},

      {
        $unwind: {
          path: '$task',
          preserveNullAndEmptyArrays: true
        }
      },


      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$dateTime" }
          },
          totalTimeSpent: { $sum: "$timeSpent" },
          logs: { $push: "$$ROOT" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Worklog fetched successfully',
      data: worklogs
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errorMessage: error.message
    });
  }
};


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

        isTaskExist.workLogs = isTaskExist.workLogs.filter(v => v._id.toString() !== req.params.id.toString());

        if(taskTypeExists == 'parenttask') {
            await TaskSchema.findByIdAndUpdate(worklog.taskId, isTaskExist, {new: true, runValidators:true});
        }else if(taskTypeExists == 'subtask') {
            await SubTaskSchema.findByIdAndUpdate(worklog.taskId, isTaskExist, {new: true, runValidators:true}); 
        }
        return res.status(200).json({
            success: true, message: 'Work Log Deleted Successfully',
        }); 
        

    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        }); 
    }
}

module.exports = {createworkLog, updateWorkLog, getAllWorkLogForSingleUser, deleteWorkLog, getFilteredWorkLog}