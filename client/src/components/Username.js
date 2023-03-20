import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../assets/logotest.png';
import styles from '../styles/Username.modules.css';

export default function username() {
  return (
    <div className="container mx-auto">
            <div className='flex justify-center items-center h-screen'>
            <div className="glass">
             <div className='title flex flex-col items-center'>
                                   <h4 className='text-5xl font-bold'>Login !</h4>
                                   <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                                     Welcome to the login interface
                                   </span>
                                   <form className="py-3">
                <div className='profile flex justify-center py-4 '>
                  <img className="porfile_img" src={logo}  alt='avatar' />
                </div>
                   <div className='textbox'>
                           <input className="textbox"  type='text' placeholder='User Name' />
                           <button className="btn" type='submit'> Login!</button>
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
