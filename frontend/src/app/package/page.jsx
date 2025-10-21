'use client'
import React, { useEffect } from 'react'
import { getPackageElement } from '@/api/modalApi'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import PackageButton from '@/components/PackageButton'
import { useState } from 'react'

// import { cart } from '@/stores/userStore'
import { doc , getDoc} from "firebase/firestore";
import {  db } from "@/config/firebase";
import { useUserStore } from '@/userStore'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import  useAddressStore  from "@/stores/useAddress";
import  useCartStore  from "@/stores/useCart";



function page() {
   
    const [isLoading , setIsLoading] = useState(true)
    const {cart , setCart} = useCartStore();
    const { email , setUserInfo , clearUserInfo } = useUserStore();
    const { setAddress } = useAddressStore();
    
    

    useEffect (()=>{
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth , async(user)=>{
      if(user){
        const docRef = doc(db, "users" , user.uid)
        const docSnap = await getDoc(docRef)
        console.log(docSnap.data())

        if(docSnap.exists()){
          console.log("Document data:", docSnap.data());
          setUserInfo(docSnap.data());
          setCart(docSnap.data().cart);
          setAddress(docSnap.data().address);
          
        }
        else{
          console.log("No such document");
          clearUserInfo();
         
        }
      }
      setIsLoading(false)
    }) 
    return () => unsubscribe();

    },[])
   
    

    const products = getPackageElement()
    console.log(products)
    
  return (
    <div className='min-h-screen bg-[#F8FAFC] pb-20'>
       
        <Navbar/>

        <main className='max-w-4xl mx-auto py-8 px-4'>
            <header className='mb-8 text-center'>
                <h1 className='text-3xl font-bold text-gray-800'>Clinic Package</h1>
                <p className='mt-2 text-gray-500'>Review the products below.</p>
            </header>

            {/* A container for the list of product cards with vertical spacing */}
            <div className='space-y-5'>
                {products.map((item)=>(
                    // Each product is a card with improved styling and a hover effect
                    <div 
                        key={item.id} 
                        className='bg-white rounded-2xl p-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out flex items-center gap-5'
                    >
                        {/* Image with a defined size and rounded corners */}
                        <Image 
                            src={item.image} 
                            width={80} 
                            height={80} 
                            alt={item.name}
                            className='rounded-xl object-cover flex-shrink-0'
                        />

                        {/* Text content that grows to fill available space */}
                        <div className='flex-grow'>
                            <h2 className='text-lg font-semibold text-gray-900'>{item.name}</h2>
                            <p className='text-sm text-gray-500'>{item.unit} unit</p>
                        </div>
                        
                        {/* The checkmark icon, now larger for better visibility */}
                        <div className='flex-shrink-0'>
                            <i className="ri-checkbox-circle-fill text-[#8C00FF] text-3xl"></i>
                        </div>
                    </div>
                ))}
            </div>
        </main>

        <PackageButton/>
    </div>
  )
}

export default page;