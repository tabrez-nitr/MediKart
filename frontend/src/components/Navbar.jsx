import React from 'react'
import Link from 'next/link'

function Navbar() {
  return (
    <div>
        <div className='px-8 pt-5 text-[20px] flex justify-between'>
        <i className="ri-menu-line"></i>
        <h2 className=' font-medium'>Pharmacy</h2>
        <Link href='/cart'><i className="ri-shopping-cart-2-fill"></i></Link>
        </div>
    </div>
  )
}

export default Navbar