import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logotest.png";
import styles from "../styles/Username.modules.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { ProfileValidation} from "../helper/validate";
import ConvertToBase64 from "../helper/convert";
import ProfileModules from "../styles/Profile.modules.css";


export default function Profile() {
  // FORMIK SETUP
  const [file,setFile] = useState();
  const formik = useFormik({
    initialValues: {
      FirstName:'',
      LastName:'',
      Email:'demoemail@domaine.com',
      Username:'demoUsername',
    },
    validate: ProfileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values,{Profile : file || ''})
      console.log(values);
    },
  });
  // FUNCTION FOR UPLOADING THE IMAGE BECAUSE FORMIK DOES NOT SUPPORT FILE UPLOAD
const onUpload = async e =>{
  const base64 = await ConvertToBase64(e.target.files[0]);
  setFile(base64);

}

  //PAGE CONTENT
  return (
    <div className="container mx-auto" style={ProfileModules.glass}>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className='{styles.glassx}' style={{width:'35%'}}>
          <div className="title flex flex-col items-center">
            <h5 className="text-3xl font-bold">Profile</h5>
            <span className="py-0 text-xl w-2/3 text-center text-gray-500">
              You can Update the Details..
            </span>
            <form onSubmit={formik.handleSubmit}>
              <div className="profile flex justify-center py-1 ">
              <label htmlFor="profile">
              <img
                  className="porfile_img"
                  src={file || logo}
                  alt="avatar"
                  style={styles.img}
                />
                <input onChange={onUpload} type="file" id="profile" name="profile" ></input>
              </label>
              </div>
              <div className="textbox" style={styles.box}>
                <div className="name flex w-3/4 gap-10">
                <input {...formik.getFieldProps("FirstName")}        className="textbox" type="text"    placeholder="FirstName*"  />
                <input {...formik.getFieldProps("LastName")}        className="textbox" type="text"    placeholder="LastName*"  />
                </div>
                <br/>
                <div className="name flex w-3/4 gap-10">
                <input {...formik.getFieldProps("Mobile")}        className="textbox" type="text"    placeholder="Mobile Number*"  />
                <input {...formik.getFieldProps("Email")}        className="textbox" type="text"    placeholder="Email*"  />
                </div>

                <button className="btn" type="submit">
                  {" "}
                  Register!
                </button>
              </div>
              <div className="text-center py-4">
                <span className="text-gray-500">
                 Come back Later ?
                  <Link className="text-red-500" to="/">
                    Logout
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
