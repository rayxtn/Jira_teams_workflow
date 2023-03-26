import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logotest.png";
import styles from "../styles/Username.modules.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { PasswordValidate } from "../helper/validate";

export default function Register() {
  // FORMIK SETUP
  const [file,setFile] = useState();
  const formik = useFormik({
    initialValues: {
      Email:'demoemail@domaine.com',
      Username:'demoUsername',
      Password: 'admin@123',
    },
    validate: PasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });
  // FUNCTION FOR UPLOADING THE IMAGE BECAUSE FORMIK DOES NOT SUPPORT FILE UPLOAD
const onUpload = async e =>{
  const base64 ='';
  setFile(base64);

}


  //PAGE CONTENT
  return (
    <div className="container mx-auto" >
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{width:'35%'}}>
          <div className="title flex flex-col items-center">
            <h5 className="text-3xl font-bold">Register</h5>
            <span className="py-0 text-xl w-2/3 text-center text-gray-500">
              Happy to see you join us !
            </span>
            <form onSubmit={formik.handleSubmit}>
              <div className="profile flex justify-center py-1 ">
              <label htmlFor="profile">
              <img
                  className="porfile_img"
                  src={logo}
                  alt="avatar"
                  style={styles.img}
                />
                <input type="file" id="profile" name="profile" ></input>
              </label>
              </div>
              <div className="textbox" style={styles.box}>
                <input {...formik.getFieldProps("Email")}        className="textbox" type="text"    placeholder="Email*"  />
                <input {...formik.getFieldProps("Username")}     className="textbox" type="text"    placeholder="Username*"  />
                <input {...formik.getFieldProps("Password")}     className="textbox" type="password"    placeholder="Password*"  />
                <button className="btn" type="submit">
                  {" "}
                  Register!
                </button>
              </div>
              <div className="text-center py-4">
                <span className="text-gray-500">
                 Already Registred ?
                  <Link className="text-red-500" to="/">
                    Login Now
                  </Link>{" "}
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
