import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to MongoDb ${conn.connection.host}`)

    }catch(error){
        console.log(`Error in mongodb ${error}`.bgRed.white);
    }
};

export default connectDB;

