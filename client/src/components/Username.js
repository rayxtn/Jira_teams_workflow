import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logotest.png";
import styles from "../styles/Username.modules.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { UsernameValidate } from "../helper/validate";

export default function Username() {
  // FORMIK SETUP

  const formik = useFormik({
    initialValues: {
      Username: "",
    },
    validate: UsernameValidate,
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
            <h5 className="text-3xl font-bold">Login Interface</h5>
            <span className="py-0 text-xl w-2/3 text-center text-gray-500">
              Welcome to the login interface
            </span>
            <form onSubmit={formik.handleSubmit}>
              <div className="profile flex justify-center py-1 ">
                <img
                  className="porfile_img"
                  src={logo}
                  alt="avatar"
                  style={styles.img}
                />
              </div>
              <div className="textbox" style={styles.box}>
                <input
                  {...formik.getFieldProps("Username")}
                  className="textbox"
                  type="text"
                  placeholder="User Name"
                />
                <button className="btn" type="submit">
                  {" "}
                  Login!
                </button>
              </div>
              <div className="text-center py-4">
                <span className="text-gray-500">
                  No account ? contact the admin or{" "}
                  <Link className="text-red-500" to="/Register">
                    Register now
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
