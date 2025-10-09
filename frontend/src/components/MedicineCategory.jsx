'use client'
import React from 'react'
import { userSelection } from '../cartStore'


const categories = [
    {
        id : 14,
        name : "all"
    },
    {
        id : 10,
        name : "Orthopedic"
    },
    {
        id: 11, 
        name : "General"
    },
    {
        id : 12 ,
        name : "Gastroenterology"
    },
    {
        id : 13 , 
        name : "Infectious-disease"
    }
]

function MedicineCategory() {
    const { selectedCategory, setSelectedCategory } = userSelection();
  return (
    <div className="px-2 py-2  bg-[#F8FAFC] w-full  pt-8">
    <div className="flex gap-3 overflow-x-auto h-[5vh] no-scrollbar">
      {categories.map((elem) => (
        <div
          key={elem.id}
          className={`px-4 text-[14px] flex items-center justify-center rounded-2xl min-w-fit cursor-pointer transition-colors duration-200 ${
            selectedCategory === elem.name.toLowerCase()
              ? "bg-[#359EFF] text-white"
              : "bg-[#FFFFFF] text-black"
          }`}
          onClick= {() => setSelectedCategory(elem.name.toLowerCase())}
        >
          <h2>{elem.name}</h2>
        </div>
      ))}
    </div>
  </div>
  )
}

export default MedicineCategory