
'use client'
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useUserStore } from '@/userStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
   const { clearUserInfo  } = useUserStore();


  const handelLogout = async() => {
    try{
       await signOut(auth);
      
       clearUserInfo();
       console.log("user logged out")
       router.push('/')
    }
    catch(error){
      console.log("user not logged out"+error)
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
        <Link href="/"><i className="ri-home-4-line"></i> Home</Link>
        <Link href="/"><i className="ri-shopping-cart-2-line"></i> Orders</Link>
        <Link href="/"><i className="ri-user-line"></i> Profile</Link>
        <Link href="/"><i className="ri-phone-line"></i> Contact Us</Link>
        </div>
        <div className='px-2'>
       <button className='absolute bottom-2 border-1 px-23 text-center rounded bg-red-400 text-white font-light py-1'
       onClick={handelLogout}>Sign out</button>
       </div>
      </div>
    </>
  );
}