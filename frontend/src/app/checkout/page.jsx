'use client';
import React, { useState, useMemo } from 'react';
import useAddressStore from '@/stores/useAddress';

import useCartStore from '@/stores/useCart';
import useOrdersStore from '@/stores/useOrders';
import { useUserStore } from '@/userStore';
import { useRouter } from 'next/navigation';

// --- MOCK STORES for Demonstration ---
const useUser = () => ({
    uid: 'mock-user-123', // A mock user ID
});
// --- END MOCK STORES ---


// --- DYNAMIC DATE CALCULATION for Delivery Estimate ---
const getDeliveryEstimate = () => {
    const today = new Date('2025-10-21T13:46:00'); // Setting a fixed "current" date for consistency
    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
    const formatDate = (date) => date.toLocaleString('en-US', { month: 'short', day: 'numeric' });

    // Returns a string like "Oct 28 - Oct 29"
    return `${formatDate(addDays(today, 7))} - ${formatDate(addDays(today, 8))}`;
};


// --- MOCK DATA for Demonstration ---
// Now a single object instead of an array
const shippingAddress = {
    id: 'addr1',
    fullName: 'Sameer Sharma',
    phone: '9876543210',
    pincode: '751001',
    state: 'Odisha',
    city: 'Bhubaneswar',
    houseNo: 'Plot No. 123, Bapuji Nagar',
    roadName: 'Near Ram Mandir'
};

const cartItems = [
    {
        id: 'item1',
        name: 'Wireless Bluetooth Earbuds',
        price: 2499,
        quantity: 1,
        imageUrl: 'https://placehold.co/100x100/e2e8f0/4a5568?text=Earbuds'
    },
    {
        id: 'item2',
        name: 'Smart Leather Wallet',
        price: 899,
        quantity: 1,
        imageUrl: 'https://placehold.co/100x100/e2e8f0/4a5568?text=Wallet'
    },
];

const DELIVERY_CHARGE = 40.00;

// --- Main Checkout Page Component ---
export default function CheckoutPage() {

    //store data 
    const { address } = useAddressStore();
    const { cart, clearCart } = useCartStore();
    const { addOrder } = useOrdersStore();
    const { uid } = useUserStore();
    const router = useRouter();

    const [selectedPayment, setSelectedPayment] = useState('upi'); // 'upi' or 'cod'

    // --- NEW STATE for confirmation animation ---
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    // ------------------------------------------

    const deliveryEstimate = getDeliveryEstimate();

    // --- MODIFIED function to handle animation ---
    const placeOrder = () => {
        setIsLoading(true); // Disable button

        // Original logic
        const data =
        {
            address: address,
            payment: 'COD',
            status: 'pending',
            items: cart,
            total: total,
        }
        addOrder(data, uid)
        clearCart(uid)

        setIsLoading(false);
        setIsConfirmed(true); // Show confirmation animation

        // Wait for 2.5 seconds before redirecting
        setTimeout(() => {
            router.push('/orders');
        }, 2500); // 2.5 seconds
    }
    // ------------------------------------------

    const paymentOptions = [
        { id: 'upi', title: 'UPI' },
        { id: 'cod', title: 'Cash on Delivery (COD)' },
    ];

    // Using useMemo to prevent recalculating on every render
    const { subtotal, total } = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const total = subtotal + DELIVERY_CHARGE;
        return { subtotal, total };
    }, [cart]);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">

            {/* --- MODIFIED: Order Confirmation Overlay for Flipkart-style --- */}
            {isConfirmed && (
  <div className="fixed inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center z-50">
    <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center relative overflow-hidden transform animate-fadeInScale">
      
      {/* Animated glowing ring behind checkmark */}
      <div className="absolute w-48 h-48 rounded-full bg-green-200 opacity-20 blur-3xl animate-pulse"></div>
      
      {/* Checkmark circle with smooth draw animation */}
      <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-green-100 shadow-inner animate-bounceIn">
        <svg
          className="w-20 h-20 text-green-600 animate-draw"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      {/* Success Text */}
      <h2 className="text-3xl font-bold text-gray-800 mt-6 animate-fadeUp delay-100">
        Order Placed Successfully!
      </h2>
      <p className="text-lg text-gray-600 mt-3 animate-fadeUp delay-200">
        Thank you for your purchase.
      </p>
      <p className="text-md text-gray-500 mt-2 animate-fadeUp delay-300">
        Redirecting to your orders...
      </p>
    </div>
  </div>
)}
            {/* --- END: Order Confirmation Overlay --- */}

            <div className="container mx-auto px-4 py-8 lg:py-12">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* Left Column: Shipping and Payment */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. Shipping Address - Now displays a single address */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <p className="font-semibold text-gray-800">{address.fullName}</p>
                                <p className="text-gray-600 text-sm mt-2">{`${address.houseNo}, ${address.roadName}`}</p>
                                <p className="text-gray-600 text-sm">{`${address.city}, ${address.state} - ${address.pincode}`}</p>
                                <p className="text-gray-600 text-sm mt-1">Phone: {address.phone}</p>
                            </div>
                        </div>

                        {/* 2. Payment Method */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                            <div className="space-y-4">
                                {paymentOptions.map(option => (
                                    <div
                                        key={option.id}
                                        onClick={() => setSelectedPayment(option.id)}
                                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedPayment === option.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400'}`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${selectedPayment === option.id ? 'border-indigo-600' : 'border-gray-400'}`}>
                                                {selectedPayment === option.id && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                                            </div>
                                            <p className="font-semibold text-gray-800">{option.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-3 bg-blue-50 text-blue-800 rounded-lg flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Estimated delivery in 7 - 8 days ({deliveryEstimate})</span>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-md sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-4">Order Summary</h2>
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                            <div>
                                                <p className="font-semibold text-gray-700">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-800">₹{item.price.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charge</span>
                                    <span>₹{DELIVERY_CHARGE.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 mt-2">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* --- MODIFIED Button with disabled state and new text --- */}
                            <button
                                onClick={placeOrder}
                                disabled={isLoading || isConfirmed}
                                className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                            >
                                {isLoading
                                    ? 'Placing Order...'
                                    : isConfirmed
                                        ? 'Success!'
                                        : (selectedPayment === 'cod' ? 'Confirm Order' : 'Proceed to Payment')
                                }
                            </button>
                            {/* -------------------------------------------------------- */}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}