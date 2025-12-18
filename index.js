const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const userRouter = require('./src/routes/user.route');
const taskRouter = require('./src/routes/task.route');
const worklogRouter = require('./src/routes/worklog.route');
const subtaskRouter = require('./src/routes/subtask.route');
const app = express();

app.use(express.json());
app.use(cors());

dotenv.config({
    override: true
})


app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);
app.use('/api/worklog', worklogRouter);
app.use('/api/task/subtask', subtaskRouter);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running on ${port}`)
})