import { create } from "zustand";

const userSelection = create((set) => ({
        selectedCategory : "all",
        setSelectedCategory: (category) => set({ selectedCategory: category }),
        cart : [         
        ] ,
        setCart : (item) => set((state)=>({
                cart : [...item , ...state.cart]
        })) // update cart if new items are added 
}))


const productsCart = create((set) => ({
       products : [], // store all the medicines 
       setProducts : (item) => set((state)=>({
                products : [...state.products , ...item]
        })) // update products if new items are added 
  
}))
export { productsCart , userSelection }