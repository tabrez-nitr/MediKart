'use client'
import React from 'react'
import { userInfo } from '@/userStore'
import Link from 'next/link';


function userCart() {
  const {cart} = userInfo();

     

  console.log(cart)

  if(cart.length === 0){
    return (
      <div className='h-screen'>
        <Link href="/package"><i className="ri-arrow-left-line absolute left-5 top-5 text-2xl"></i></Link>
        <h2 className='text-[20px] font-medium text-center pt-5'>Cart</h2>
          <div className='flex justify-center mt-40'>
            <i className="ri-shopping-cart-fill text-8xl text-black/70"></i>

          </div>
          <h2 className='text-[20px] font-medium text-center pt-5'>Your cart is empty</h2>
      </div>
    )
  }
  return (
   <div>




    <Link href="/package"><i className="ri-arrow-left-line absolute left-5 top-5 text-2xl"></i></Link>
    <h2 className='text-[20px] font-medium text-center pt-5'>Cart</h2>
    
     

     {cart.map((item)=>(
      <div className='flex flex-col items-center justify-center'>
        <h1>{item.name}</h1>
        <p>{item.price}</p>
        <img src={item.image} alt="" />
      </div>
     ))}

      


   </div>
  )
}

export default userCart