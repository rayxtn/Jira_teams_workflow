import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../assets/logotest.png';
import styles from '../styles/Username.modules.css';

export default function username() {
  return (
    <div className="container mx-auto">
            <div className='flex justify-center items-center h-screen'>
            <div className={styles.glass}>
                     <div className='title flex flex-col items-center'>

                                   <h4 className='text-5xl font-bold'>Hello Again !</h4>
                                   <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                                     welcome to the login interface
                                   </span>

                <form className='py-1'>
                <div className='profile flex justify-center py-4 '>
                  <img src={logo} className={styles.profile_img} alt='avatar' />
                </div>
                   <div className="textbox">
                           <input className={styles.textbox} type='text' placeholder='User Name' />
                           <button className={styles.btnw} type='submit'> Login!</button>
                   </div>
                   <div className='text-center py-4'>
                   <span className='text-gray-500'>No account ? contact the admin or  <Link className='text-red-500' to='/Register'>Register now</Link>   </span>
                   </div>
                </form>

    </div>
    </div>
    </div>
    </div>
  );
}
