
'use client'
import React, { useState } from 'react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

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
       <button className='absolute bottom-2 border-1 px-23 text-center rounded bg-red-400 text-white font-light py-1'>Sign out</button>
       </div>
      </div>
    </>
  );
}