const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URL + 'idsTaskify');
}

module.exports = connectDB;