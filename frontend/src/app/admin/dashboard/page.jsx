'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase'; // Your firebase config
import Admin from '../page'; // Assuming this is your login component redirect
import useAdminStore from '@/stores/useAdmin'; // Assuming you still use this for auth check

function AdminDashboard() {
    const { isAdmin, setIsAdmin } = useAdminStore(); // Get auth state
    const [usersData, setUsersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false); // State for update loading
    const [error, setError] = useState(null);

    // --- Authentication Check ---
    useEffect(() => {
        // Replace this with your actual admin authentication check
        const checkAuth = () => {
             // Example: Check local storage or a context
             const authenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
             if (!authenticated) {
                 setIsAdmin(false); // Update Zustand store if using
                 // Optionally redirect using next/navigation if needed here
                 // router.push('/admin/login');
             } else {
                 setIsAdmin(true);
             }
        };
        checkAuth();
    }, [setIsAdmin]);


    // --- Data Fetching ---
    useEffect(() => {
        // Only fetch data if the user is authenticated as admin
        if (!isAdmin) {
             setIsLoading(false); // Stop loading if not admin
             return;
        }

        const fetchAllUsersData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const usersCollectionRef = collection(db, "users");
                const querySnapshot = await getDocs(usersCollectionRef);

                const allUsers = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name || 'N/A',
                    email: doc.data().email || 'N/A',
                    orders: doc.data().order || [], // Use the 'order' field name from your DB
                }));

                setUsersData(allUsers);

            } catch (err) {
                console.error("Error fetching users data:", err);
                setError("Failed to fetch user data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllUsersData();
    }, [isAdmin]); // Re-fetch if admin status changes (e.g., after login)


    // --- Status Update Handler ---
    const handleStatusChange = async (userId, orderIndex, newStatus) => {
        setIsUpdating(true);
        setError(null);

        const userDocRef = doc(db, "users", userId);

        try {
            // 1. Read the current user document
            const docSnap = await getDoc(userDocRef);
            if (!docSnap.exists()) {
                throw new Error("User document not found.");
            }

            const userData = docSnap.data();
            const currentOrders = userData.order || [];

            // 2. Create the updated orders array
            const updatedOrders = currentOrders.map((order, index) => {
                if (index === orderIndex) {
                    return { ...order, status: newStatus }; // Update the status of the specific order
                }
                return order;
            });

            // 3. Write the entire updated array back to Firestore
            await updateDoc(userDocRef, {
                order: updatedOrders // Overwrite the 'order' field
            });

            // 4. Update local state to reflect the change immediately
            setUsersData(prevUsersData =>
                prevUsersData.map(user =>
                    user.id === userId ? { ...user, orders: updatedOrders } : user
                )
            );

        } catch (err) {
            console.error("Error updating order status:", err);
            setError("Failed to update status. Please try again.");
            // Optionally, revert local state changes here if needed
        } finally {
            setIsUpdating(false);
        }
    };


    // --- Render Logic ---

    // Redirect or show login if not admin
    if (!isAdmin && !isLoading) { // Check isLoading to prevent brief flash of login page
        return <Admin />;
    }

    // Show loading state
    if (isLoading) {
        return <div className="p-8 text-center">Loading user data...</div>;
    }

    // Show error state
    if (error) {
        return <div className="p-8 text-center text-red-600">{error}</div>;
    }

    // --- Main Dashboard UI ---
    return (
        <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard - Customer Orders</h1>

            {usersData.length === 0 ? (
                <p className="text-center text-gray-500">No users or orders found.</p>
            ) : (
                <div className="space-y-8 max-w-6xl mx-auto">
                    {usersData.map((user) => (
                        user.orders && user.orders.length > 0 && (
                            <div key={user.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">
                                    User: {user.name} <span className="text-gray-500 font-normal">({user.email})</span>
                                </h2>

                                {/* Loop through orders for this user */}
                                <div className="space-y-5">
                                    {user.orders.map((order, index) => {
                                        // Determine badge color based on status
                                        let statusColor = "bg-gray-200 text-gray-700"; // Default (Pending)
                                        if (order.status === 'Processing') statusColor = "bg-yellow-200 text-yellow-800";
                                        if (order.status === 'Delivered') statusColor = "bg-green-200 text-green-800";
                                        if (order.status === 'Cancelled') statusColor = "bg-red-200 text-red-800";

                                        return (
                                            <div key={index} className="border border-blue-100 rounded-lg p-4 bg-blue-50/30">
                                                <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-800">Order #{index + 1}</h3>
                                                       <p className="text-sm text-gray-500">
    Placed on: {order.createdAt && typeof order.createdAt === 'string' // Check if it exists and is a string
        ? new Date(order.createdAt).toLocaleString() // Try parsing the string
        : 'N/A'} {/* Fallback if missing or not a string */}
</p>
                                                    </div>
                                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColor}`}>
                                                        {order.status || 'Pending'}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Order Value */}
                                                    <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
                                                        <p className="font-semibold text-blue-600">Order Total:</p>
                                                        <p className="text-lg font-bold text-gray-700">
                                                            ₹{order.total ? order.total.toFixed(2) : 'N/A'}
                                                        </p>
                                                         <p className="text-xs text-gray-500">Payment: {order.payment || 'N/A'}</p>
                                                    </div>

                                                    {/* Shipping Address */}
                                                    <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
                                                        <p className="font-semibold text-blue-600">Shipping Address:</p>
                                                        {order.address && typeof order.address === 'object' ? (
                                                            <div className="text-sm text-gray-600 mt-1 space-y-px">
                                                                <p>{order.address.fullName || 'N/A'}</p>
                                                                <p>{order.address.houseNo || ''} {order.address.roadName || ''}</p>
                                                                <p>{order.address.city || ''} - {order.address.pincode || ''}, {order.address.state || ''}</p>
                                                                <p>Ph: {order.address.phone || 'N/A'}</p>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-500 mt-1">N/A</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status Update Dropdown */}
                                                <div className="mt-4 flex items-center gap-2">
                                                    <label htmlFor={`status-${user.id}-${index}`} className="text-sm font-medium text-gray-700">Update Status:</label>
                                                    <select
                                                        id={`status-${user.id}-${index}`}
                                                        value={order.status || 'Pending'}
                                                        onChange={(e) => handleStatusChange(user.id, index, e.target.value)}
                                                        disabled={isUpdating} // Disable while an update is in progress
                                                        className="border border-gray-300 rounded-md p-1 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                    {isUpdating && <span className="text-xs text-blue-500">Updating...</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;