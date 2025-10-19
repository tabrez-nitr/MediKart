import React from 'react'
import { getPackageElement } from '@/api/modalApi'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import PackageButton from '@/components/PackageButton'

function page() {

    const products = getPackageElement()
    console.log(products)
    
  return (
    <div className='bg-[#F8FAFC] pb-15'>
       
        <Navbar/>
        <div className='px-3 mt-8'>
            {products.map((item)=>(
                <div key={item.id} className=' mt-4 rounded-[20px] px-3 py-4 grid grid-cols-[1.5fr_2fr_1fr] gap-10  bg-[#FFFFFF] shadow-[0_0_10px_#0000001A]'>
                    <Image src={item.image} width={100} height={100} alt=""  className='border-1'/>
                    <div className='flex flex-col justify-center '>
                    <h2 className='font-medium'>{item.name}</h2>
                    <p className='text-[15px] text-[black]/50'>{item.unit} unit</p>
                    </div>
                    <div className='flex flex-col justify-center '>
                    <i className="ri-checkbox-circle-fill text-[#8C00FF] text-[16px]"></i>
                    </div>
                    
                </div>
            ))}
        </div>
        <PackageButton/>
    </div>
  )
}

export default page