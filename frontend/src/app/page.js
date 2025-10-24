'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/userStore";
import useCartStore from "@/stores/useCart";
import useAddressStore from '@/stores/useAddress';


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { cart, setCart } = useCartStore();
  const { email, setUserInfo, clearUserInfo } = useUserStore();
  const { setAddress } = useAddressStore();

  const handleButtonClick = () => {
    console.log("button clicked");
    if (email) {
      router.push('/package');
    } else {
      router.push('/login');
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        console.log("Firebase user data:", docSnap.data());

        if (docSnap.exists()) {
          console.log("Document data for user:", docSnap.data());
          setUserInfo(docSnap.data());
          // Ensure cart and address are handled gracefully if they don't exist
          setCart(docSnap.data().cart || []); 
          setAddress(docSnap.data().address || null); // Assuming address can be null
        } else {
          console.log("No such user document");
          clearUserInfo();
        }
      } else {
        console.log("No user is signed in.");
        clearUserInfo(); // Clear user info if no user is signed in
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setCart, setAddress, setUserInfo, clearUserInfo]); // Add all dependencies

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-800">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-white p-4 relative">
      {/* Logo Section - Centered with flexbox */}
      <div className="flex-grow flex flex-col justify-center items-center">
        {/* Placeholder for your Fundaymeter logo image */}
        {/* Make sure to replace "/fundaymeter-logo.png" with the actual path to your logo */}
        <Image
          src="/fundameterLogo.png" // Replace with your logo path
          alt="Fundaymeter Logo"
          width={300} // Adjust width as needed
          height={150} // Adjust height as needed, aspect ratio might differ
          layout="intrinsic" // or "responsive" depending on your needs
        />
        {/* Optional: If you still want the text "Fundameter" below the logo, make it dark */}
        <h1 className="text-[28px] font-bold text-gray-800 mt-4">Fundaymeter</h1>
        <p className="text-gray-600 mt-2 text-[16px] text-center">Partnering with your fitness</p>
        <p className="text-gray-600 mt-2 text-[16px] text-center">Set up your account to get started.</p>
      </div>

      {/* Button Section - Fixed at the bottom */}
      <div className="w-full flex justify-center pb-8"> {/* Padding-bottom to lift it slightly */}
        <button
          onClick={handleButtonClick}
          className="text-[20px] font-medium bg-indigo-500 text-white px-10 py-3 rounded-lg shadow-lg hover:bg-[#6a00cc] transition-colors duration-200 w-full max-w-sm"
        >
          Set Up Fundameter Account
        </button>
      </div>
    </div>
  );
}