const mongoose = require('mpngoose');
const dotenv = require('dotenv');

dotenv.config();

const DBConnection = async ()=> {
    const MONGODB_URL = process.env.MONGODB_URI;
    try{
        await mongoose.connect(MONGODB_URL, {useNewUrlParser: true});
        console.log("Database connected successfully");
    }catch(err){
        console.error("Error connecting to the database:", err);
        throw err;
    }
}

module.exports = DBConnection;