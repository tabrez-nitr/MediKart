import  { create } from "zustand";

const useAdminStore = create((set, get)=>(
    {
        isAdmin : false,
        setIsAdmin : (value)=>set({isAdmin : value})
    }
))

export default useAdminStore