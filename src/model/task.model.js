const mongoose = require('mongoose');
const subtaskSchema = require('./subtask.model');
const { workLogSchema } = require('./worklog.model');

const taskSchema = new mongoose.Schema({
    taskId: {type:String, required:true, unique: true},
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
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    subTasks: [subtaskSchema],
    workLogs: [workLogSchema]
}
,{
    timestamps:true,
    versionKey:false
}
)
const TaskSchema = mongoose.model('task', taskSchema);
module.exports = TaskSchema;