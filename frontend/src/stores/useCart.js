import { create } from "zustand";
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Import getDoc
import { db } from "@/config/firebase"; // Assuming your firebase config is exported as 'db'

const useCartStore = create((set, get) => ({
    cart : [],
    setCart : (cart) => set({ cart }),
    removeCart : () => set({ cart : [] }),
    
    /**
     * Clears the cart in both local state and Firestore.
     * @param {string} userId - The ID of the currently logged-in user.
     */
    clearCart: async (userId) => {
        const originalCart = get().cart; // Keep a backup in case of an error

        // 1. Optimistically clear the local state for a quick UI response
        set({ cart: [] });

        // 2. Update the Firestore database
        if (userId) {
            const userDocRef = doc(db, "users", userId);
            try {
                // Set the cart field in Firestore to an empty array
                await updateDoc(userDocRef, { cart: [] });
                console.log("Cart cleared in Firestore successfully!");
            } catch (error) {
                console.error("Error clearing cart in Firestore: ", error);
                // If Firestore fails, revert the local state change
                set({ cart: originalCart });
            }
        } else {
            console.error("No user ID provided. Cannot clear cart in database.");
        }
    },
    
    /**
     * This function adds a new item to the cart and then saves the entire
     * updated cart to the user's document in Firestore.
     * @param {object | array} itemToAdd - The product item (or an array containing it) to add.
     * @param {string} userId - The ID of the currently logged-in user.
     */
    addToCart: async (itemToAdd, userId) => {
        // Handle cases where an array is passed instead of an object.
        const newItem = Array.isArray(itemToAdd) ? itemToAdd[0] : itemToAdd;

        // Ensure newItem is a valid object before proceeding
        if (!newItem || typeof newItem !== 'object' || !newItem.id) {
            console.error("addToCart was called with invalid data:", itemToAdd);
            return;
        }

        // Prevent adding duplicate items.
        const itemExists = get().cart.some(item => item.id === newItem.id);
        if (itemExists) {
            console.log("Item already in cart.");
            // If item exists, just increase its quantity instead of adding a duplicate
            get().increaseQuantity(newItem.id, userId);
            return; 
        }

        // **FIX:** Provide default fallback values (like null) for any optional properties.
        // This prevents 'undefined' values from being sent to Firestore, which causes an error.
        const cleanItem = {
            id: newItem.id,
            name: newItem.name,
            price: newItem.price,
            image: newItem.image,
            unit: newItem.unit || null, // If newItem.unit is undefined, use null instead.
            quantity: 1 
        };

        // 1. Add the clean item to the local cart state first for a responsive UI
        set((state) => ({
            cart: [...state.cart, cleanItem]
        }));

        // 2. Save the updated item to the Firestore database
        if (userId) {
            const userDocRef = doc(db, "users", userId);
            try {
                // Read the doc, update the array in memory, and write it back.
                const docSnap = await getDoc(userDocRef);
                const userData = docSnap.exists() ? docSnap.data() : {};
                const currentCart = userData.cart || [];
                const updatedCart = [...currentCart, cleanItem];
                await updateDoc(userDocRef, {
                    cart: updatedCart
                });
                console.log("Cart updated in Firestore successfully!");
            } catch (error) {
                console.error("Error updating cart in Firestore: ", error);
                // If Firestore fails, revert the local state change
                set((state) => ({
                    cart: state.cart.filter(item => item.id !== newItem.id)
                }));
            }
        } else {
            console.error("No user ID provided. Cannot save cart to database.");
        }
    },

    // This function will fetch the cart from firestore and set it in the local state
    // You should call this once when the user logs in
    initializeCart: (initialCart) => {
        set({ cart: initialCart || [] });
    },
    
    /**
     * Removes an item from the cart in both local state and Firestore.
     * @param {number} id - The ID of the item to remove.
     * @param {string} userId - The ID of the currently logged-in user.
     */
    removeItem : async (id, userId) => {
        const originalCart = get().cart;
        
        // 1. Optimistically update the local state for a quick UI response
        set((state) => ({
            cart: state.cart.filter(item => item.id !== id)
        }));

        // 2. Update the Firestore database
        if (userId) {
            const userDocRef = doc(db, "users", userId);
            try {
                const updatedCart = get().cart; // Get the latest state after removal
                await updateDoc(userDocRef, { cart: updatedCart });
                console.log("Item removed from Firestore successfully!");
            } catch (error) {
                console.error("Error removing item from Firestore: ", error);
                set({ cart: originalCart }); // Revert on error
            }
        } else {
            console.error("No user ID provided. Cannot update database.");
        }
    },

    /**
     * Increases the quantity of a specific item in the cart.
     * @param {number} id - The ID of the item to increase.
     * @param {string} userId - The ID of the currently logged-in user.
     */
    increaseQuantity: async (id, userId) => {
        const originalCart = get().cart;
         
        console.log("inside increase qty called ")
        // 1. Update local state
        set((state) => ({
            cart: state.cart.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        }));

        // 2. Update Firestore
        if (userId) {
            const userDocRef = doc(db, "users", userId);
            try {
                const updatedCart = get().cart;
                await updateDoc(userDocRef, { cart: updatedCart });
                console.log("Quantity increased in Firestore successfully!");
            } catch (error) {
                console.error("Error increasing quantity in Firestore: ", error);
                set({ cart: originalCart }); // Revert on error
            }
        }
    },

    /**
     * Decreases the quantity of a specific item in the cart.
     * If quantity becomes 1, the item is removed.
     * @param {number} id - The ID of the item to decrease.
     * @param {string} userId - The ID of the currently logged-in user.
     */
    decreaseQuantity: async (id, userId) => {
        const originalCart = get().cart;
        const itemToDecrease = originalCart.find(item => item.id === id);

        // If item quantity is 1, remove it completely instead of going to 0
        if (itemToDecrease && itemToDecrease.quantity <= 1) {
            get().removeItem(id, userId); // Use the existing removeItem function
            return;
        }

        // 1. Update local state
        set((state) => ({
            cart: state.cart.map(item =>
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
        }));

        // 2. Update Firestore
        if (userId) {
            const userDocRef = doc(db, "users", userId);
            try {
                const updatedCart = get().cart;
                await updateDoc(userDocRef, { cart: updatedCart });
                console.log("Quantity decreased in Firestore successfully!");
            } catch (error) {
                console.error("Error decreasing quantity in Firestore: ", error);
                set({ cart: originalCart }); // Revert on error
            }
        }
    }
    
}));

export default useCartStore;

