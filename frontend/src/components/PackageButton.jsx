'use client'
import React, { useState, useEffect } from 'react' // Import useState
import  useCartStore  from '@/stores/useCart'
import {useUserStore} from '@/userStore' // Corrected import path assumption
import { useRouter } from 'next/navigation'

// Assuming Remix Icons are set up, otherwise import an icon component
// import { RiShoppingCart2Fill } from 'react-icons/ri';

function PackageButton() { // Renamed component to follow React conventions (PascalCase)

    const router = useRouter();
    const { addToCart } = useCartStore(); // Only get the action we need
    const email = useUserStore((state) => state.email); // Use selector for reactive email
    const uid = useUserStore((state) => state.uid);     // Use selector for reactive uid

    // State to control the notification visibility
    const [showNotification, setShowNotification] = useState(false);

    const packageItem = [{ // Define the item directly
      id : 20002 ,
      name : "Fundameter Package" ,
      price : 1000 ,
      image : "/fundameterPackage.png",
      // Quantity is handled inside addToCart store logic now
    }]

    // Redirect if user logs out while on this page (optional but good practice)
    useEffect(() => {
        if (!email) {
          // You might want to redirect to login or home, depending on your app flow
          // router.push('/login');
        }
    }, [email, router]);

    const handleAddToCart = () => {
        if (!uid) {
            console.error("User ID not found. Cannot add to cart.");
            // Optionally redirect to login or show a message
            router.push('/login');
            return;
        }
        console.log("Add to cart clicked for user:", uid);
        addToCart(packageItem[0],uid); // Pass the single product object, not the array

        // Show the notification
        setShowNotification(true);

        // Hide the notification after 3 seconds
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    }

    return (
        <>
            {/* --- Notification Banner --- */}
            <div
                className={`fixed top-0 rounded-2xl left-0 right-0 z-50 p-4 bg-green-100 border-b border-green-300 text-green-800 text-center shadow-md transition-transform duration-300 ease-in-out ${
                    showNotification ? 'translate-y-0' : '-translate-y-full'
                }`} // Slides down or up
            >
                Product added to cart!
            </div>

            {/* --- Sticky Button --- */}
            {/* Added padding-bottom to body or main layout is recommended to prevent overlap */}
            <div className='fixed bottom-0 left-0 right-0 z-10 w-full p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]'> {/* Added padding and shadow */}
                <div className='flex justify-center'>
                    <button
                        onClick={handleAddToCart}
                        className='w-full max-w-md text-white bg-[#8C00FF] hover:bg-[#7a00e6] px-10 text-[18px] md:text-[20px] py-3 rounded-[12px] flex items-center justify-center gap-2 transition-colors duration-200' // Added hover, responsive text, flex for icon
                    >
                        <i className="ri-shopping-cart-2-fill text-xl"></i> {/* Assuming Remix Icons */}
                        Add to Cart
                    </button>
                </div>
            </div>
        </>
    )
}

export default PackageButton; // Renamed export
