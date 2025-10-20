import { create } from "zustand";

const useCartStore = create((set) => ({
    cart : [],
    setCart : (cart) => set((state)=>({cart : [...cart  , ...state.cart ]})),
    clearCart : () => set((state)=>({cart : []})),
    removeItem : (id) => set((state)=>({cart : state.cart.filter(item => item.id !== id)})),
}))

export default useCartStore
