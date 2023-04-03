import React from "react";

import styles from "../styles/Username.modules.css";
import { Toaster } from "react-hot-toast";



export default function Recovery() {


  

  //PAGE CONTENT
  return (
    <div className="container mx-auto" style={styles.box}>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className="container">
          <div className="title flex flex-col items-center">
            <h5 className="text-3xl font-bold">Recovery</h5>
            <span className="py-20 text-xl w-2/3 text-center text-gray-500">
              Enter OTP to recover the password.
            </span>
            <form className="textbox" >

            <span className="text-gray-500">
                 Enter 6 digit to be sent to your email Address 
                </span>
             
              <div className="textbox" >
                <input
                
                  className="textbox"
                  type="password"
                  placeholder="OTP"
                />
                <button className="btn" type="submit">
                  {" "}
                  Send!
                </button>
              </div>
              <div className="text-center py-4">
              <span className="text-gray-500">
                Cannot get OTP ? <button className="text-red-500">Resend</button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
