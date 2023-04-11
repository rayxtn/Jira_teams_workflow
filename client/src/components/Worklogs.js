import React from "react";
import styles from '../styles/Username.module.css'
//import toast, { Toaster } from 'react-hot-toast';
//  <Toaster position='top-center' reverseOrder={false}></Toaster>

export default function Worklogs() {
  return (
    <div className="container mx-auto">
      <div className='flex justify-center items-center h-screen'>
          <div className="title flex flex-col items-center">
          <h4 className='text-5xl font-bold'>Project Name</h4>
          <h4 className='text-5xl font-bold'>Getting the Issues from the project</h4>
            <h4 className='text-5xl font-bold'>Getting the Worklogs from the issue</h4>
          </div>
          <form className='py-20'>
              <div className="textbox flex flex-col items-center gap-6">
                  <button className={styles.btn} type='submit'>Get Issues</button>
                  <button className={styles.btn} type='submit'>Get Worklogs</button>
              </div>

          </form>

        </div>
      </div>
  )
}


