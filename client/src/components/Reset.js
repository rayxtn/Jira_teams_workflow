import React from "react";


import styles from "../styles/Username.modules.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { PasswordConfirmValidation } from "../helper/validate";

export default function Reset() {
  // FORMIK SETUP

  const formik = useFormik({
    initialValues: {
      Password: '',
      confirm_pwd : ''
    },
    validate: PasswordConfirmValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  //PAGE CONTENT
  return (
    <div className="container" style={styles.box}>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className="">
          <div className="title flex flex-col items-center">
            <h5 className="text-3xl font-bold">Reset</h5>
            <span className="py-0 text-xl w-2/3 text-center text-gray-500">
              Enter New Password.
            </span>
            <form className="py-20" onSubmit={formik.handleSubmit}>
             
              <div className="textbox" style={styles.box}>
                <input {...formik.getFieldProps("Password")} className="textbox" type="password" placeholder="Password"/>
                <input {...formik.getFieldProps("confirm_pwd")} className="textbox" type="password" placeholder="Confirme Password"/>
                <button className="btn" type="submit">
                  {" "}
                  Reset!
                </button>
              </div>
              <div className="text-center py-4">
   
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
