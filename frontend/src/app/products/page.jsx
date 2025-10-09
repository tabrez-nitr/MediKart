
'use client'
import React from 'react'
import MedicineCategory from '@/components/MedicineCategory'
import getMedicines from '@/api/medicines'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { userSelection } from '@/cartStore'
import { useEffect , useState } from 'react'



 function Products() {

  const { selectedCategory } = userSelection()
  const [medicines, setMedicines] = useState([])


   useEffect(()=>{
     
       
       const fetchData = async() => {
        try{
            const data = await getMedicines()
            setMedicines(data)
        }
        catch(error){
          console.log(error)
        }
       }
       fetchData()
   },[])
   console.log(medicines)

  return (
    <div className='bg-[#F8FAFC]'>
      <Navbar/>
     <MedicineCategory/>
      
      <div className='grid grid-cols-2 gap-3 px-2 mt-5 '>
        {medicines.filter((elem)=> selectedCategory === "all" || selectedCategory === elem.category.toLowerCase())
        .map((elem) => (
          <div key={elem.id}>
          
             <div   className=' px-2 rounded-[20px] bg-[#FFFFFF] shadow-[0_0_10px_#0000001A]'>
             <div className='flex justify-center'>
            <Image 
            src={elem.image} 
            alt="MediKart Logo" 
            width={100} 
            height={100} 
            priority  // optional: loads early
            /></div> 
             <h2 className='text-center  font-medium'>{elem.name}</h2>
             <p className='text-center text-[12px] text-[black]/50'>{elem.details}</p>
            
            <p className='text-center font-bold mb-2'>₹{elem.price}</p>
            <div className='flex justify-center text-[18px] mb-2'>
            <button className='border-1  bg-[#359EFF] px-8 py-1 text-white mb-2 rounded-[12px] '><i className="ri-shopping-cart-2-line text-[19px] "></i>&nbsp; Add</button>
            </div>
          </div>
          </div>
        )
         
        )}
      </div>

     </div>
  )
}

export default Products