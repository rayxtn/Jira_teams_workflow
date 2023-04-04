import mongoose from 'mongoose';
//import connectdb from '../database/connectdb.js';
export const worklogsSchema = new mongoose.Schema({
    issueId :{
        type : String,
        unique: false
    },
    created :{
        type : String,
    },
    updated :{
        type : String,

    },
    started :{
        type : String
    },
    timeSpent :{
            type : String
    },   
    accountId :{
                type : String}              
});


export default mongoose.model.Worklogs || mongoose.model('Worklogs',worklogsSchema);
