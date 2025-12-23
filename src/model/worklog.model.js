const mongoose = require('mongoose');

const workLogSchema = new mongoose.Schema({
    dateTime: {type: Date, required: true},
    description: {type: String, required: false},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    taskId: {type: mongoose.Schema.Types.ObjectId, ref: 'task'},
    timeSpent: {type: Number, required: true}
}
,{
    timestamps:true,
    versionKey:false
}
);

const WorkLogSchema = mongoose.model('worklog', workLogSchema)

module.exports = {workLogSchema, WorkLogSchema}