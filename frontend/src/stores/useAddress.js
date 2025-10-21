import { create } from "zustand";
// --- Updated Firebase imports (removed arrayUnion) ---
import { db } from "../config/firebase"; // 👈 Adjust this path to your firebase config file
import { doc, updateDoc } from "firebase/firestore"; // 👈 Removed arrayUnion

const useAddressStore = create((set, get) => ({
  address: {},
  isLoading: false,
  setAddress: (address) => {
    set({ address });
    console.log("New address:", get().address);
  },
  clearAddress: () => {
    set({ address: {} });
    console.log("Address cleared");
  },

  // --- Updated function to save address as an object ---
  saveAddressToFirebase: async (addressForm , uid) => {
    if (!uid) {
      console.error("UID is required to save address");
      return;
    }

    set({ isLoading: true });
    const addressToSave = addressForm; // Get the current address from state

    try {
      const userDocRef = doc(db, "users", uid);

      // --- This is the changed part ---
      // This will set/overwrite the 'address' field with the new object
      await updateDoc(userDocRef, {
        address: addressToSave,
      });

      console.log("Address saved to Firebase successfully!");
    } catch (error) {
      console.error("Error saving address to Firebase:", error);
    } finally {
      set({ isLoading: false }); // Stop loading state
    }
  },
}));

export default useAddressStore;