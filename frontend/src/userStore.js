import { create } from "zustand";

const userInfo = create((set)=>({
     name : "",
     setName : (name) => set((state)=>({name : name})),
     email : "",
     setEmail : (email) => set((state)=>({email : email})),
     role : "",
     setRole : (role) => set((state)=>({role : role})),
     uid : "",
     setUid : (uid) => set((state)=>({uid : uid})),
     address : [],
     setAddress : (address) => set((state)=>({address : [...address , ...state.address]})),
     cart : [],
     setCart : (cart) => set((state)=>({cart : [...cart , ...state.cart]}))
}))

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


export { userInfo , orderInfo  }