const mongoose = require('mongoose');
const { workLogSchema } = require('./worklog.model');

const subtaskSchema = new mongoose.Schema({
    taskType: {type:String, required:false, default: 'SubTask'},
    taskUniqueId: {type:String, required:false},
    projectName: {type: String, required: true},
    workType: {type: String, required: true},
    status: {type: String, required: true, default:'Todo'},
    summary: {type:String, required: true},
    description: {type: String, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    priority: {type: String, required: false, default: 'Medium'},
    startDate: {type: String, required: false},
    endDate: {type: String, required: false},
    dueDate: {type: String, required: false},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    reporter: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    taskId: {type: mongoose.Schema.Types.ObjectId, ref: 'task'},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    workLogs: [workLogSchema]
}
,{
    timestamps:true,
    versionKey:false
}
)

subtaskSchema.index(
  { taskUniqueId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      taskUniqueId: { $exists: true, $ne: null }
    }
  }
);

const SubTaskSchema = mongoose.model('subtasks', subtaskSchema)

module.exports = {subtaskSchema, SubTaskSchema};