import { getFirestore, collection, doc, writeBatch, getDocs } from "firebase/firestore";
import { app } from "../config/firebase"; // Your initialized Firebase app

const db = getFirestore(app);

/**
 * Syncs the local cart state with the user's cart sub-collection in Firestore.
 * It deletes all old items and replaces them with the current local cart.
 * @param {string} userId The ID of the logged-in user.
 * @param {Array} localCart The current cart array from your Zustand store.
 */


export const syncCartWithFirestore = async (userId, localCart) => {
  // 1. Safety Check: Don't run if there's no user.
  if (!userId) {
    console.log("No user ID provided, skipping sync.");
    return;
  }

  // 2. Create a correct reference to the user's cart sub-collection.
  const cartCollectionRef = collection(db, "users", userId, "cart");

  try {
    const batch = writeBatch(db);

    // 3. Plan to delete all existing documents in the Firestore cart.
    const querySnapshot = await getDocs(cartCollectionRef);
    querySnapshot.forEach((document) => {
      batch.delete(document.ref);
    });

    // 4. Plan to add all items from the current local cart.
    localCart.forEach((item) => {
      // Use the item's unique ID for the new document reference.
      const newItemRef = doc(cartCollectionRef, item.id);
      batch.set(newItemRef, {
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
      });
    });

    // 5. Execute all operations at once (this is the correct placement).
    await batch.commit();
    console.log("Firestore cart successfully synced!");

  } catch (error)
    {
    console.error("An error occurred while syncing cart with DB:", error);
  }
};