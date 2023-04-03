import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logotest.png";
import styles from "../styles/Username.modules.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { PasswordValidate } from "../helper/validate";

export default function Password() {
  // FORMIK SETUP

  const formik = useFormik({
    initialValues: {
      Password: "",
    },
    validate: PasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  //PAGE CONTENT
  return (
    <div className="container mx-auto" >
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className="container">
          <div className="title flex flex-col items-center">
            <h5 className="text-3xl font-bold">Login Interface</h5>
            <span className="py-0 text-xl w-2/3 text-center text-gray-500">
              Welcome to the login interface
            </span>
            <form onSubmit={formik.handleSubmit} className="textbox">
              <div className="profile flex justify-center py-1 ">
                <img
                  className="porfile_img"
                  src={logo}
                  alt="avatar"
                  style={styles.img}
                />
              </div>
              <div className="textbox" >
                <input
                  {...formik.getFieldProps("Password")}
                  className="textbox"
                  type="password"
                  placeholder="Password"
                />
                <button className="btn" type="submit">
                  {" "}
                  Signup!
                </button>
              </div>
              <div className="text-center py-4">
                <span className="text-gray-500">
                 Forgot Password ?
                  <Link className="text-red-500" to="/Recovery">
                    Recover Password Now
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
