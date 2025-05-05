import mongoose from "mongoose";
// funcion de conexion de mongo
export const connectMongoDB = async () => {
    try {
        mongoose.connect("mongodb+srv://proyecto_node:proyectonode@eccomerce-cluster.p2dux.mongodb.net/Backend_3_Test?retryWrites=true&w=majority&appName=eccomerce-cluster");
        console.log("MongoDB connect");
    } catch (error) {
        console.log (`Error: ${error}`);
    }
}