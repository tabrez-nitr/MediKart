
'use client'
import React from "react";
import { signInWithPopup } from 'firebase/auth'
import { auth , provider } from '@/config/firebase'
import { userInfo } from '@/userStore'
import { doc , setDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

export default function GoogleLogIn() {

    const { email ,setEmail , name , setName , role , setRole , uid , setUid , setAddress , setCart } = userInfo()

  const handleGoogleLogin = async() => {
    try{
        const result = await signInWithPopup(auth , provider);
        const user = result.user;
        console.log(user)   
        console.log("user logged in")
        console.log("user email : "+user.email)
        console.log("user name : "+user.displayName)
        console.log("user uid : "+user.uid)
       

        console.log("user email : "+email)
        
        // reffernce of the document 
        const docRef = doc(db, "users" ,user.uid)
        // create user in this reffernce 
        await setDoc(docRef , {
            name : user.displayName,
            email : user.email,
            uid : user.uid,
            address : [],
            role: "user",
            cart : []
        },{merge : true})


        //zustand update 
        setEmail(user.email)
        setName(user.displayName)
        setUid(user.uid)
        setRole("user")
        setAddress([])
        setCart([])
    }
    catch(error){
        console.log(error)
    }
  };

  return (
    <div>
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Welcome Back</h1>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full border border-gray-300 rounded-xl py-2 hover:bg-gray-100 transition duration-200"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="w-5 h-5 mr-2"
          />
          <span className="text-gray-700 font-medium">Login with Google</span>
        </button>
      </div>
      
    </div>
    {email && (
        <div style={{ marginTop: '20px' }}>
          <h2>User Information:</h2>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>UID:</strong> {uid}</p>
          <p><strong>Role:</strong> {role}</p>
        </div>
      )}
    </div>
  );
}