import { toast, Toast } from "react-hot-toast";

//VALIDATE LOGIN PAGE USERNAME WITH 
export async function UsernameValidate(values)
{
    const errors = UsernameVerify({},values);
    return errors;
}


//VALIDATE USERNAME
 function UsernameVerify(error={},values){
    if(!values.Username) {
        error.Username = toast.error("Username Required !");
    }else if(values.Username.includes(" ")){
        error.Username = toast.error("Invalied Username !");
    }
    return error;

}