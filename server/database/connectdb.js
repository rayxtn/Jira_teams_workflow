import mongoose from "mongoose";


async function connectdb(){

    mongoose.set('strictQuery', true);

    const db = mongoose.connect("mongodb+srv://dbcrud:testing123955@cluster0.e1keysk.mongodb.net/test?retryWrites=true&w=majority")
    console.log("database connected !");
    return db;

} 


export default connectdb;