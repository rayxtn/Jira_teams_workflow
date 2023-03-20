import React from 'react'

export default function username() {
  return (
    <div className="container mx-auto">
            <div className='flex justify-center items-center h-screen'>
                     <div className='title flex flex-col items-center'>

                                   <h4 className='text-5xl font-bold'>Hello Again !</h4>
                                   <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                                     welcome to the login interface
                                   </span>

                <form className='py-1'>
                <div className='profile flex justify-center py-4 '>
                  <img src='' alt='avatar' />
                </div>
                   <div className="textbox">
                           <input type='text' placeholder='User Name' />
                           <button type='submit'>Login!</button>
                   </div>
                </form>

    </div>
    </div>
    </div>
  );
}
