import { create } from "zustand";

const useUserStore = create((set) => ({
  // --- STATE ---
  name: "",
  email: "",
  role: "",
  uid: "",
  addresses: [], // An array to hold address objects

  // --- ACTIONS ---

  // Sets all user info at once, typically after login
  setUserInfo: (userData) => set({
    name: userData.displayName || "",
    email: userData.email || "",
    uid: userData.uid || "",
    role: userData.role || "customer", // Default to customer
    addresses: userData.addresses || [],
  }),

  // Action to add a SINGLE new address to the array
  addAddress: (newAddress) => set((state) => ({
    addresses: [...state.addresses, newAddress],
    // This correctly creates a new array with the old addresses plus the new one.
  })),
  
  // Action to remove an address by its label or ID
  removeAddress: (addressLabel) => set((state) => ({
    addresses: state.addresses.filter(addr => addr.label !== addressLabel),
  })),

  // Clears all user info, typically on logout
  clearUserInfo: () => set({
    name: "",
    email: "",
    uid: "",
    role: "",
    addresses: [],
  }),
}));



const orderInfo = create((set)=>(
    {
        order : [],
        setOrder : (order) => set((state)=>({order : [...order  , ...state.order ]})),
        shippingAddress :'',
        setShippingAddress : (address) => set((state)=>({shippingAddress : {...address , ...state.shippingAddress}})),
        status : "",
        setStatus : (status) => set((state)=>({status : status})),

    }
))


export { useUserStore , orderInfo  }