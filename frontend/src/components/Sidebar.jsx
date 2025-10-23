'use client'
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useUserStore } from '@/userStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import useAddressStore from '@/stores/useAddress';
import useCartStore from '@/stores/useCart';

export default function Sidebar() {


  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const { clearUserInfo } = useUserStore();
  const { clearAddress } = useAddressStore();
  const { clearCart , removeCart } = useCartStore();

  const handelLogout = async() => {
    try{
       await signOut(auth);
       clearUserInfo();
       clearAddress();
       removeCart();

       console.log("user logged out");
       router.push('/');
    }
    catch(error){
      console.log("user not logged out"+error);
    }
  };

  // Array for navigation links to make the code cleaner
  const navLinks = [
    { href: "/", icon: "ri-home-4-line", label: "Home" },
    { href: "/orders", icon: "ri-shopping-cart-2-line", label: "Orders" }, // Assuming a different route
    { href: "/profile", icon: "ri-user-line", label: "Profile" }, // Assuming a different route
    { href: "/contactUs", icon: "ri-phone-line", label: "Contact Us" }, // Assuming a different route
  ];

  return (
    <>
      {/* --- Hamburger Button --- */}
      <div className="">
        <button 
          onClick={handleOpen} 
        >
         ☰
        </button>
      </div>
      {/* <Navbar/> */}

      {/* --- Fading Overlay --- */}
      {/* <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
      /> */}
      
      {/* --- Sliding Sidebar --- */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col p-4 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
     
        {/* --- Sidebar Header --- */}
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-xl font-bold text-gray-800'>Menu</h2>
          <button onClick={handleClose} className="text-gray-500 text-2xl hover:text-gray-800" aria-label="Close sidebar">
            <i className="ri-close-line"></i>
          </button>
        </div>

        {/* --- Navigation Links --- */}
        <nav className='flex flex-col gap-2'>
          {navLinks.map((link) => (
            <Link 
              key={link.label}
              href={link.href}
              onClick={handleClose}
              className='flex items-center gap-4 px-4 py-3 text-gray-600 font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors'
            >
              <i className={`${link.icon} text-2xl`}></i>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        
        {/* --- Sign Out Button (Pushed to the bottom) --- */}
        <div className='mt-auto'>
          <button 
            className='w-full flex items-center gap-4 px-4 py-3 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors'
            onClick={handelLogout}
          >
            <i className="ri-logout-box-r-line text-2xl"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}