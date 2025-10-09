import { create } from "zustand";

const userSelection = create((set) => ({
        selectedCategory : "all",
        setSelectedCategory: (category) => set({ selectedCategory: category })
}))


const productsCart = create((set) => ({
       products : [] // store all the medicines 
}))


export { productsCart , userSelection }