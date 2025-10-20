'use client'
import React from 'react'
import { useUserStore } from '@/userStore'




function packageButton() {

    // const {cart , setCart} = useUserStore();

    // const handelAddToCart = () => {
    //     console.log("Add to cart clicked")
    //     setCart([...cart , {id : 20002 , name : "Fundameter Package" , price : 1000 , image : "/fundameterPackage.png"}])
    // }
  return (
    <div className='fixed bottom-5 z-10 w-full'>
        <div className='flex justify-center '>
            <button
            //  onClick={handelAddToCart}
             className='w-[96%] text-white bg-[#8C00FF]  px-10 text-[20px] py-3 rounded-[12px]'>
                <i className="ri-shopping-cart-2-fill t"></i> Add to Cart</button>
        </div>
    </div>
  )
}

export default packageButton