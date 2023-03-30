import mongoose from 'mongoose';
export const UserSchema = new mongoose.Schema({
    Username :{
        type : String,
        required : [true, "Pleaase provide unique username"],
        unique: [true,"Username Exist"]
    },
    password :{
        type : String,
        required : [true, "Pleaase provide a password"],
        unique: false
    },
    email :{
        type : String,
        required : [true, "Pleaase provide unique email"],
        unique: true
    },
    firstname :{
        type : String},
    lastname :{
            type : String},
    mobile :{
                type : Number},
    profile :{
                    type : String}        
             
});


export default mongoose.model.Users || mongoose.model('User',UserSchema);
