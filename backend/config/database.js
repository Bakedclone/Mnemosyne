import mongoose from "mongoose";

export const connectDB = async ()=> {
    const { connection } = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected with ${connection.host}`);
    // mongoose.connect("mongodb://127.0.0.1:27017/OodoTask").then(() => console.log("Connected to Database Successfully!!")).catch((err) => console.log(err));
}