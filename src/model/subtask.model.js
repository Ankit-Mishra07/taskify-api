const mongoose = require('mongoose');
const { workLogSchema } = require('./worklog.model');

const subtaskSchema = new mongoose.Schema({
    projectName: {type: String, required: true},
    workType: {type: String, required: true},
    status: {type: String, required: true, default:'Todo'},
    summary: {type:String, required: true},
    description: {type: String, required: true},
    createdBy: {type: String, required: true},
    priority: {type: String, required: false, default: 'Medium'},
    startDate: {type: String, required: false},
    endDate: {type: String, required: false},
    dueDate: {type: String, required: false},
    assignedTo: {type: String, required: true},
    reporter: {type: String, required: true},
    taskId: {type: mongoose.Schema.Types.ObjectId, ref: 'task'},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    workLogs: [workLogSchema]
}
,{
    timestamps:true,
    versionKey:false
}
)

module.exports = subtaskSchema;