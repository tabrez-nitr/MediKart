'use client'
import React from 'react'

import Link from 'next/link';
import { useState } from 'react';
import useCartStore from '@/stores/useCart';
import { useUserStore } from '@/userStore';
import useAddressStore from '@/stores/useAddress';
import { useRouter } from 'next/navigation';
import Address from '@/components/Address';


// Renamed to UserCart (PascalCase) which is a standard convention for React components
function UserCart() {

   const [isModalOpen, setIsModalOpen] = useState(false);


  const { cart } = useCartStore();
  const { uid } = useUserStore();
  const { address , addressShip , setAddressShip } = useAddressStore();
  const router = useRouter();
  console.log("from cart"+JSON.stringify(address))
  const sample = [{
    id : 2000020002,
    name : "Fundameter Package",
    price : 1000,
    image : "/fundameterPackage.png",
    quantity: 1, // Added for calculation example
  }]

  console.log( cart )
  const { removeItem } = useCartStore();

   
  const handleCheckout = () => {
    if(address){
        router.push("/checkout")
    }else{
    }
  }

 

  // --- Improved Empty Cart View ---
  // If your cart is empty, this cleaner UI will be displayed.
  // Note: For demonstration, this won't show unless you change 'sample' to an empty array [].
  if (cart.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4'>
        
        <div className='p-8 bg-white rounded-full shadow-md mb-6'>
          <i className="ri-shopping-cart-line text-6xl text-indigo-500"></i>
        </div>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Your cart is empty</h1>
        <p className='text-gray-500 mb-8'>Looks like you haven't added anything to your cart yet.</p>
        <Link 
          href="/package" 
          className='px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105'
        >
          Continue Shopping
        </Link>
      </div>
    )
  }
  
  // --- Cart with Items View ---
  const subtotal = sample.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = 50; // Example shipping fee
  const total = subtotal + shippingFee;

  return (
   <div className='min-h-screen bg-[#F8FAFC] font-sans'>
    
    {/* --- Header --- */}
    <header className='relative flex items-center justify-center py-4 bg-white shadow-sm'>
        <Link href="/package" className="absolute left-4 top-1/2 -translate-y-1/2">
          <i className="ri-arrow-left-line text-2xl text-gray-600 hover:text-indigo-600 transition-colors"></i>
        </Link>
        <h1 className='text-xl font-bold text-gray-800'>Shopping Cart</h1>
    </header>

    <main className='max-w-4xl mx-auto p-4 md:p-6'>
    
     
     {address ? (<div className='bg-white grid grid-cols-[3fr_1fr] rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] p-3 px-3 mb-5 text-[14px]'>
          <div>
          <p>Deliver to : <span className="font-semibold"> {address.fullName}, {address.pincode} </span></p>
          <p className='text-black/60'> {address.phone}, {address.city} ...</p>
          </div>
          <button 
          onClick={() => setIsModalOpen(true)}
           className='text-[20px] text-indigo-600'><i className="ri-edit-fill"></i></button>

     </div>) : (<div className='mb-4 flex justify-end'>
              <button 
              onClick={() => setIsModalOpen(true)}
              className='text-[20px] text-indigo-600'><i className="ri-edit-fill"></i></button>
     </div>)} 



        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

          {/* --- Cart Items List --- */}
          <div className='lg:col-span-2 space-y-4'>
            {cart.map((item)=>(
              <div key={item.id} className='p-4 bg-white rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex items-center gap-4'>
                 {/* Item Image */}
                <img src={item.image} alt={item.name} className='w-24 h-24 object-cover rounded-xl flex-shrink-0' />
                
                <div className='flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                  {/* Item Details */}
                  <div>
                    <h1 className='text-lg font-semibold text-gray-800'>{item.name}</h1>
                    <p className='font-bold text-indigo-600 text-base'>₹ {item.price.toLocaleString()}</p>
                  </div>



                  {/* Quantity & Delete */}
                  <div className='flex items-center gap-4'>
                      <div className='flex items-center gap-2 text-lg bg-gray-100 rounded-full p-1'>
                        <button className='w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full transition'>-</button>
                        <span className='w-8 text-center font-medium text-base'>{item.quantity}</span>
                        <button className='w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full transition'>+</button>
                      </div>


                      <button 
                      onClick={()=>removeItem(item.id, uid)}
                      className='text-gray-400 hover:text-red-500 transition-colors'>
                        <i className="ri-delete-bin-6-line text-2xl"></i>
                      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
         

          {/* --- Order Summary --- */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] p-6'>
              <h2 className='text-xl font-bold text-gray-800 border-b pb-4 mb-4'>Order Summary</h2>
              <div className='space-y-3 text-gray-600'>
                <div className='flex justify-between'>
                  <p>Subtotal</p>
                  <p className='font-medium'>₹ {subtotal.toLocaleString()}</p>
                </div>
                <div className='flex justify-between'>
                  <p>GST</p>
                  <p className='font-medium'>₹ {shippingFee.toLocaleString()}</p>
                </div>
              </div>
              <div className='border-t my-4'></div>
              <div className='flex justify-between font-bold text-lg text-gray-800'>
                <p>Total</p>
                <p>₹ {total.toLocaleString()}</p>
              </div>

              <button 
              onClick={handleCheckout}
              className='w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105'>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </main>
      <Address
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
   </div>
  )
}

export default UserCart;