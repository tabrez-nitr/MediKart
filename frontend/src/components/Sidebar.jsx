
'use client'
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { userInfo } from '@/userStore';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handelLogout = async() => {
    try{
       await signOut(auth);
       const { setEmail , setName , role , setRole , uid , setUid , address , setAddress  } = userInfo();
       setEmail("")
       setName("")
       setRole("")
       setUid("")
       setAddress([])
       console.log("user logged out")
    }
    catch{
      console.log("user not logged out")
    }
  }

  return (
    <>
      <div style={{ padding: '' }}>
        <button className="open-btn" onClick={handleOpen}>
          ☰ 
        </button>
      </div>

      <div
        className={`overlay ${isOpen ? 'open' : ''}`}
        onClick={handleClose}
      />
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
     
       <div className='flex justify-end'> <a href="#" className="right-2" onClick={handleClose}>
          X
        </a></div>
        <div className='mt-2'>
        <a href="#"><i className="ri-home-4-line"></i> Home</a>
        <a href="#"><i className="ri-shopping-cart-2-line"></i> Orders</a>
        <a href="#"><i className="ri-user-line"></i> Profile</a>
        <a href="#"><i className="ri-phone-line"></i> Contact Us</a>
        </div>
        <div className='px-2'>
       <button className='absolute bottom-2 border-1 px-23 text-center rounded bg-red-400 text-white font-light py-1'
       onClick={handelLogout}>Sign out</button>
       </div>
      </div>
    </>
  );
}