import React from 'react'
import Link from 'next/link'
import Sidebar from './Sidebar'

function Navbar() {
  return (
    <div>
        <div className='px-8 pt-5 text-[20px] flex justify-between'>
       <Sidebar/>
        <h2 className=' font-medium'>Fundameter</h2>
        <Link href='/cart'><i className="ri-shopping-cart-2-fill"></i></Link>
        </div>
    </div>
  )
}

export default Navbar