import { create } from "zustand";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase"; // adjust path as per your setup
import { arrayUnion } from "firebase/firestore";


const useOrdersStore = create((set,get)=>({
    orders : [],
    setOrders : (orders)=>set({orders}),
    isLoading: false,
    clearOrders : ()=>set({orders : []}),


    addOrder : async (order, uid) => {
        if (!uid) {
            console.error("UID is required to add order");
            return;
        }

        set({ isLoading: true });
        const orderToSave = order; // Get the current order from state

        try {
            const userDocRef = doc(db, "users", uid);

             const orderToSave = {
            ...order,
            createdAt: new Date().toISOString(), // optional metadata
             };

            // --- This is the changed part ---
            // This will set/overwrite the 'order' field with the new object
           await updateDoc(userDocRef, {
            order: arrayUnion(orderToSave),
              });

              set({ orders: [orderToSave, ...get().orders] });

            console.log("Order added to Firebase successfully!");
        } catch (error) {
            console.error("Error adding order to Firebase:", error);
        } finally {
            set({ isLoading: false }); // Stop loading state
        }
    },
}))

export default useOrdersStore;