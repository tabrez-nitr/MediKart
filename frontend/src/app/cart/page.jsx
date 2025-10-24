'use client'
import React from 'react'
import Link from 'next/link';
import { useState, useMemo } from 'react'; // Import useMemo
import useCartStore from '@/stores/useCart';
import { useUserStore } from '@/userStore';
import useAddressStore from '@/stores/useAddress';
import { useRouter } from 'next/navigation';
import Address from '@/components/Address'; // Assuming this component exists

// Renamed to UserCart (PascalCase) which is a standard convention for React components
function UserCart() {

   const [isModalOpen, setIsModalOpen] = useState(false);

  // Use selectors to get reactive state
  const cart = useCartStore((state) => state.cart);
  const { increaseQuantity, decreaseQuantity, removeItem, clearCart } = useCartStore(); // Get actions
  const uid = useUserStore((state) => state.uid);
  const { address } = useAddressStore(); // Assuming this returns the single selected address
  const router = useRouter();

  console.log("from cart"+JSON.stringify(address))
  // Removed sample data as we are using the real cart state

  console.log("Current Cart:", cart )

  const handleCheckout = () => {
    // Basic check if address exists before redirecting
    if(address && address.fullName){ // Check a specific property to ensure it's not empty
        router.push("/checkout")
    } else {
        // If no address, open the address selection/addition modal
        setIsModalOpen(true);
        // Optionally show a message: alert("Please select or add a shipping address first.");
    }
  }

  // --- Improved Empty Cart View ---
  if (!Array.isArray(cart) || cart.length === 0) { // Check if cart is array and empty
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4'>
        <div className='p-8 bg-white rounded-full shadow-md mb-6'>
          {/* Using Remix Icon directly if available */}
          <i className="ri-shopping-cart-line text-6xl text-indigo-500"></i>
        </div>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Your cart is empty</h1>
        <p className='text-gray-500 mb-8'>Looks like you haven't added anything yet.</p>
        <Link
          href="/package" // Link to where users can add items
          className='px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105'
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  // --- Cart with Items View ---
  const shippingFee = 50; // Example shipping fee

  // --- CORRECTED CALCULATION using useMemo and the reactive 'cart' state ---
  const { subtotal, total } = useMemo(() => {
      // Ensure cart is an array before reducing
      const currentCart = Array.isArray(cart) ? cart : [];
      const calculatedSubtotal = currentCart.reduce((sum, item) => {
          // Ensure price and quantity are valid numbers
          const price = typeof item.price === 'number' ? item.price : 0;
          const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
          return sum + (price * quantity);
      }, 0);
      const calculatedTotal = calculatedSubtotal + shippingFee;
      return { subtotal: calculatedSubtotal, total: calculatedTotal };
  }, [cart]); // Dependency array includes 'cart', so it recalculates when cart changes

  return (
   <div className='min-h-screen bg-[#F8FAFC] font-sans'>

    {/* --- Header --- */}
    <header className='relative flex items-center justify-center py-4 bg-white shadow-sm '> {/* Added border */}
        <button onClick={() => router.back()} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors"> {/* Changed Link to button for back action */}
          <i className="ri-arrow-left-line text-2xl text-gray-600"></i>
        </button>
        <h1 className='text-xl font-bold text-gray-800'>Shopping Cart</h1>
    </header>

    <main className='max-w-4xl mx-auto p-4 md:p-6'>


     {/* --- Address Selection/Display --- */}
     {address && address.fullName ? (
          <div className='bg-white grid grid-cols-[1fr_auto] items-center rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.05)] p-4 px-5 mb-5 text-sm border border-gray-100'> {/* Adjusted styling */}
              <div>
                  <p className="text-gray-500 text-xs mb-1">Deliver to:</p>
                  <p><span className="font-semibold text-gray-800"> {address.fullName}, {address.pincode} </span></p>
                  <p className='text-black/60 mt-0.5 truncate'> {address.houseNo || ''}, {address.roadName || ''}, {address.city || ''}...</p> {/* Added truncation */}
              </div>
              <button
                  onClick={() => setIsModalOpen(true)}
                  className='p-2 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors' // Changed icon to text/button
              >
                 Change
              </button>
          </div>
      ) : (
          <div className='mb-5 flex justify-between items-center bg-white p-4 rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-100'>
              <p className="text-gray-600 text-sm">Please select a delivery address.</p>
              <button
                  onClick={() => setIsModalOpen(true)}
                  className='px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-md hover:bg-indigo-200 transition-colors'
              >
                  Select Address
              </button>
          </div>
      )}

        {/* --- Cart Grid --- */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8'> {/* Adjusted gap */}

          {/* --- Cart Items List --- */}
          <div className='lg:col-span-2 space-y-4'>
            {Array.isArray(cart) && cart.map((item)=>( // Added check for array
              <div key={item.id} className='p-4 bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex items-center gap-4 border border-gray-100'> {/* Adjusted styling */}
                 {/* Item Image */}
                <img src={item.image || 'https://placehold.co/96x96/e2e8f0/4a5568?text=Img'} alt={item.name} className='w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0 border' /> {/* Responsive image size */}

                <div className='flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                  {/* Item Details */}
                  <div className="min-w-0"> {/* Allow text to wrap/truncate */}
                    <h2 className='text-md md:text-lg font-semibold text-gray-800 leading-tight'>{item.name}</h2> {/* Adjusted font size */}
                    <p className='font-bold text-indigo-600 text-sm md:text-base mt-1'>₹ {item.price ? item.price.toLocaleString() : 'N/A'}</p> {/* Added price check */}
                  </div>

                  {/* Quantity & Delete */}
                  <div className='flex items-center gap-3 sm:gap-4 flex-shrink-0'> {/* Adjusted gap */}
                      {/* Quantity Control */}
                      <div className='flex items-center gap-1 text-base bg-slate-100 rounded-full p-1'> {/* Adjusted background and gap */}
                        <button
                            onClick={()=> decreaseQuantity(item.id)} // Removed uid, handled in store
                            className='w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full transition disabled:opacity-50' // Responsive size
                            disabled={item.quantity <= 1} // Disable if quantity is 1
                        >
                            <i className="ri-subtract-line text-lg"></i> {/* Icon */}
                        </button>
                        <span className='w-8 text-center font-medium text-sm md:text-base'>{item.quantity}</span>
                        <button
                            onClick={()=> increaseQuantity(item.id)} // Removed uid, handled in store
                            className='w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full transition' // Responsive size
                        >
                             <i className="ri-add-line text-lg"></i> {/* Icon */}
                        </button>
                      </div>
                      {/* Delete Button */}
                      <button
                          onClick={()=>removeItem(item.id)} // Removed uid, handled in store
                          className='text-gray-400 hover:text-red-500 transition-colors p-1' // Added padding
                      >
                        <i className="ri-delete-bin-6-line text-xl md:text-2xl"></i> {/* Responsive icon size */}
                      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>


          {/* --- Order Summary --- */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.05)] p-6 sticky top-6 border border-gray-100'> {/* Added sticky positioning and border */}
              <h2 className='text-lg font-bold text-gray-800 border-b pb-3 mb-4'>Order Summary</h2> {/* Adjusted font size */}
              <div className='space-y-2 text-sm text-gray-600'> {/* Adjusted font size */}
                <div className='flex justify-between'>
                  <p>Subtotal</p>
                  <p className='font-medium text-gray-800'>₹ {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p> {/* Formatting */}
                </div>
                <div className='flex justify-between'>
                  <p>Delivery Fee</p> {/* Renamed */}
                  <p className='font-medium text-gray-800'>₹ {shippingFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p> {/* Formatting */}
                </div>
              </div>
              <div className='border-t my-4'></div>
              <div className='flex justify-between font-bold text-lg text-gray-900'> {/* Adjusted font size */}
                <p>Total Amount</p> {/* Renamed */}
                <p>₹ {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p> {/* Formatting */}
              </div>

              <button
                  onClick={handleCheckout}
                  className='w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed' // Added disabled styles
                  disabled={!address || !address.fullName} // Disable if no address selected
              >
                Proceed to Checkout
              </button>
               {!address || !address.fullName && (
                   <p className="text-xs text-red-500 mt-2 text-center">Please select a delivery address.</p>
               )}
            </div>
          </div>
        </div>
      </main>
      {/* Address Modal Component */}
      <Address
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          // Pass any other necessary props to Address component
      />
   </div>
  )
}

export default UserCart;
