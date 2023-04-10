import mongoose from "mongoose";
import ENV from '../config.js'


async function connect(){

    mongoose.set('strictQuery', true);

    const db = await mongoose.connect(ENV.ATLAS_URI)
    console.log("database connected !");
    return db;

} 


export default connect;