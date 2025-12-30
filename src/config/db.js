const mongoose = require('mongoose');
// mongodb+srv://AnkitMishra07:ankit07@cluster0.jxwud.mongodb.net
const connectDB = async () => {
    mongoose.set('strictQuery', true);
    await mongoose.connect('mongodb+srv://AnkitMishra07:ankit07@cluster0.jxwud.mongodb.net/' + 'idsTaskify');
}

module.exports = connectDB;