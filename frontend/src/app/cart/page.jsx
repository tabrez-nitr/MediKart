'use client'
import React from 'react'
import { userSelection , } from '@/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect , useState } from 'react'
import { getCartProducts } from '@/api/apiService'


function userCart() {

  const { cart , setCart } = userSelection()
  console.log(cart)
  const [ cartElem , setCartElem ] = useState([])
  const [total , setTotal] = useState(0)

 useEffect(()=>{
  const fetchdata = async()=> {
    try {
      const response = await getCartProducts()
      console.log("cart products " +response)
      setCart(response)
      setCartElem(response)
      console.log(setCartElem)
    }
    catch(error){
      console.log(error)
    }
  }
  fetchdata()
 },[])

  // if(cart.length === 0)
  //   return (
  //   <div className='px-5 pt-4'>
  //   <h2 className='text-[20px] font-medium text-center'>Your Cart Is Empty</h2>
  //   </div>
  //   )



  return (
    <div className=' pt-4 bg-[#F8FAFC]'>
     <div className='px-5'>
      {/* topbar */}
      <div className='flex '>
       <Link href="/package"><i className="ri-arrow-left-line text-[20px]"></i></Link>
       <div className='flex justify-center w-[100%]'><h2 className='text-[20px] font-medium '>Cart</h2></div>
      </div>

      <div className='mt-10'>
        {cartElem.map((item)=>(

          <div key={item.id} className='mb-4 shadow-[0_0_10px_#0000001A] rounded-2xl px-5 py-3 bg-[#FFFFFF]'>
            <div className='flex justify-between '>
              <div className='flex gap-2'>
            <Image src={item.image} alt="MediKart Logo" width={50} height={50} priority />
            <div className='flex flex-col justify-center items-center'>
              <h2>{item.name}</h2>
               <p className='font-medium '>₹{item.price}</p>
            </div>
            </div>
                
              <div className='text-black/70'>
                {/* delete  */}
                <div className='flex justify-end'><button className='mb-3'><i className="ri-delete-bin-7-line text-[17px]"></i></button></div>
              {/* qty buttons  */}
              <div className='flex justify-center items-center gap-2 ml-4 text-black/70'>
              <button className="bg-[#F2F2F2] rounded-full w-8 h-8 flex items-center justify-center">-</button>
                <p>{item.qty}</p>
                <button  className='bg-[#F2F2F2] rounded-full w-8 h-8 flex items-center justify-center'>+</button>
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* checkout button  */}
      <div className='absolute bottom-5 w-full '>
        <div className='flex justify-center'>
      <button className='border-1 px-20 text-[16px] font-medium text-white bg-[#359EFF] py-3 rounded-[12px]'>Proceed to Checkout</button>
      </div>
      </div>
      
    </div>
  )
}

export default userCart