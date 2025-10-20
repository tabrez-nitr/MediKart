'use client'
import Image from "next/image";
import { useEffect,useState } from "react";
import { auth } from "@/config/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {doc , getDoc} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/userStore";
import  useCartStore  from "@/stores/useCart";





export default function Home() {


  const [isLoading , setIsLoading] = useState(true)
  const router = useRouter()

  const {cart , setCart} = useCartStore();

  const { email , setUserInfo , clearUserInfo } = useUserStore();



  const handelButtonClick = () => {
  
    console.log("button clicked")
    if(email)
    router.push('/package')
    else 
    router.push('/login')
  }

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


  if(isLoading){
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }


  return (
    <div className="min-h-screen  flex flex-col">
     < div className="flex justify-center items-center  min-h-screen">
        <h1 className="text-[20px] font-medium"> Fundameter </h1>
        </div>
        <div className="flex justify-center">
        <button
        onClick={handelButtonClick}
         className="text-[20px] font-medium bg-[#8C00FF] text-white px-10 py-2 rounded absolute bottom-5 ">Set Up Fundameter Account</button>
        </div>
    </div>
  );

  }