import { toast } from "react-hot-toast";

//VALIDATE LOGIN USERNAME WITH 

export async function UsernameValidate(values)
{
    const errors = UsernameVerify({},values);
    return errors;
}
//VALIDATE PASSWORD
export async function PasswordValidate(values)
{
    const errors = PasswordVerify({},values);
    return errors;
}
//VALIDATE RESET PASSWORD

export async function PasswordConfirmValidation(values)
{
    const errors = PasswordVerify({},values);

    if(values.password !== values.confirm_pwd){
        errors.exist("Password does not match ! try again..");
    }
    return errors;
}


// FUNCTION VALIDATE PASSWORD
function PasswordVerify(error={}, values)
{
  
    if(!values.Password){
        error.Password = toast.error("Password Required !");
     } else if(values.Password.includes(" ")){
            error.Password = toast.error("Invalid Password !");
        }else if(values.Password.length < 5)
        {
            error.Password =toast.error("Password length must be longer !");
        }
        return error;
    }



// FUNCTION VALIDATE USERNAME

 function UsernameVerify(error={},values){
    if(!values.Username) {
        error.Username = toast.error("Username Required !");
    }else if(values.Username.includes(" ")){
        error.Username = toast.error("Invalied Username !");
    }
    return error;

}