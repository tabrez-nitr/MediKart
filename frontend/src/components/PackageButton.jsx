'use client'
import React from 'react'
import  useCartStore  from '@/stores/useCart'
import {useUserStore} from '@/userStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';





function packageButton() {
    
    const router = useRouter();
    const {cart , setCart , addToCart} = useCartStore();
    const { email  , uid } = useUserStore();
    const packageItem = [
      {
      id : 20002 ,
      name : "Fundameter Package" ,
      price : 1000 ,
      image : "/fundameterPackage.png",
      quantity : 1
    },
    ]

  console.log("your email is "+email)
   useEffect(() => {
    if (!email) {
      router.push('/');
    }
  }, [email, router]);

    const handelAddToCart = () => {
        console.log("Add to cart clicked")
        addToCart(packageItem , uid)
       
    }
  return (
    <div className='fixed bottom-5 z-10 w-full'>
        <div className='flex justify-center '>
            <button
             onClick={handelAddToCart}
             className='w-[96%] text-white bg-[#8C00FF]  px-10 text-[20px] py-3 rounded-[12px]'>
                <i className="ri-shopping-cart-2-fill t"></i> Add to Cart</button>
        </div>
    </div>
  )
}

export default packageButton