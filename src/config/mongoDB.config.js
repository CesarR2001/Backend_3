import mongoose from "mongoose";
import envsConfig from "./envs.config.js";
// funcion de conexion de mongo
export const connectMongoDB = async () => {
    try {
        mongoose.connect(envsConfig.MONGO_URL);
        console.log("MongoDB connect");
    } catch (error) {
        console.log (`Error: ${error}`);
    }
}