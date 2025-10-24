'use client';

import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
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
    const [sortOption, setSortOption] = useState('dateDesc'); // State for sorting
    const [filterStatus, setFilterStatus] = useState('all'); // State for filtering by status

    // --- Authentication Check ---
    useEffect(() => {
        const checkAuth = () => {
             const authenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
             setIsAdmin(authenticated);
             // Note: Redirection should ideally happen outside useEffect or use Next.js router properly
             if (!authenticated && window.location.pathname !== '/admin/login') {
                // Example redirect, adjust as needed
                // window.location.href = '/admin/login';
             }
        };
        checkAuth();
    }, [setIsAdmin]);


    // --- Data Fetching ---
    useEffect(() => {
        if (!isAdmin) {
             setIsLoading(false);
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
                    orders: (doc.data().order || []).map((o, index) => ({
                        ...o,
                        originalIndex: index, // Store original index for updates
                        // Convert createdAt string/timestamp to Date object for reliable sorting
                        createdAtDate: o.createdAt
                            ? (o.createdAt.seconds ? new Date(o.createdAt.seconds * 1000) : new Date(o.createdAt))
                            : null // Handle missing createdAt
                    })),
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
    }, [isAdmin]);


    // --- Status Update Handler (Remains the same logic) ---
     const handleStatusChange = async (userId, orderIndex, newStatus) => {
        setIsUpdating(true);
        setError(null);
        const userDocRef = doc(db, "users", userId);
        try {
            const docSnap = await getDoc(userDocRef);
            if (!docSnap.exists()) throw new Error("User document not found.");
            const userData = docSnap.data();
            // Use 'order' field as per DB structure
            const currentOrders = userData.order || [];
            // Create the updated array, preserving Date objects and originalIndex locally
            const updatedOrders = currentOrders.map((orderData, index) => {
                 if (index === orderIndex) {
                     // Only update status in the data to be saved
                     return { ...orderData, status: newStatus };
                 }
                 return orderData;
            });

            // Prepare data for Firestore (remove temporary fields if necessary, though updateDoc handles extra fields)
            const ordersToSave = updatedOrders.map(({ createdAtDate, originalIndex, ...rest }) => rest);


            await updateDoc(userDocRef, { order: ordersToSave }); // Save cleaned data

            // Update local state including the temporary fields for immediate UI consistency
             setUsersData(prevUsersData =>
                prevUsersData.map(user => {
                    if (user.id === userId) {
                         const newLocalOrders = user.orders.map((o, idx) => {
                             if (idx === orderIndex) {
                                 return { ...o, status: newStatus };
                             }
                             return o;
                        });
                        return { ...user, orders: newLocalOrders };
                    }
                    return user;
                })
            );


        } catch (err) {
            console.error("Error updating order status:", err);
            setError("Failed to update status. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };


    // --- Flatten, Filter, and Sort Orders using useMemo ---
    const filteredAndSortedOrders = useMemo(() => {
        // 1. Flatten the orders
        const flatOrders = usersData.reduce((acc, user) => {
            if (user.orders && user.orders.length > 0) {
                user.orders.forEach((order, index) => {
                    acc.push({
                        ...order,
                        userId: user.id,
                        userName: user.name,
                        userEmail: user.email,
                        originalIndex: index, // Ensure originalIndex is passed for updates
                    });
                });
            }
            return acc;
        }, []);

        // 2. Filter the flattened array based on filterStatus
        const filteredOrders = filterStatus === 'all'
            ? flatOrders
            : flatOrders.filter(order => (order.status || 'Pending') === filterStatus); // Default to 'Pending' if status is missing

        // 3. Sort the filtered array based on sortOption
        if (sortOption === 'dateDesc') {
            return filteredOrders.sort((a, b) => (b.createdAtDate || 0) - (a.createdAtDate || 0));
        } else if (sortOption === 'statusPrio') {
            const statusOrder = { 'Pending': 1, 'Processing': 2, 'Delivered': 3, 'Cancelled': 4 };
            return filteredOrders.sort((a, b) => {
                const statusA = statusOrder[a.status || 'Pending'] || 5;
                const statusB = statusOrder[b.status || 'Pending'] || 5;
                if (statusA !== statusB) {
                    return statusA - statusB;
                }
                return (b.createdAtDate || 0) - (a.createdAtDate || 0);
            });
        }
        return filteredOrders; // Return filtered if no sort matches
    }, [usersData, sortOption, filterStatus]); // Recalculate when data, sort, or filter changes


    // --- Render Logic ---
    if (!isAdmin && !isLoading) {
        return <Admin />;
    }
    if (isLoading) {
        return <div className="p-8 text-center">Loading user data...</div>;
    }
    if (error) {
        return <div className="p-8 text-center text-red-600">{error}</div>;
    }

    // --- Main Dashboard UI ---
    return (
        <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>

             {/* Sorting and Filtering Controls */}
             <div className="max-w-6xl mb-6 flex  gap-2">
                 {/* Filter Dropdown */}
                 <div>
                     <label htmlFor="filter-status" className="text-sm font-medium text-gray-700 mr-2 self-center">Filter by Status:</label>
                     <select
                         id="filter-status"
                         value={filterStatus}
                         onChange={(e) => setFilterStatus(e.target.value)}
                         className="border border-gray-300 rounded-md p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                     >
                         <option value="all">All Statuses</option>
                         <option value="Pending">Pending</option>
                         <option value="Processing">Processing</option>
                         <option value="Delivered">Delivered</option>
                         <option value="Cancelled">Cancelled</option>
                     </select>
                 </div>
                 {/* Sort Dropdown */}
                <div>
                    <label htmlFor="sort-orders" className="text-sm font-medium text-gray-700 mr-2 self-center">Sort by:</label>
                    <select
                        id="sort-orders"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="border border-gray-300 rounded-md p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="dateDesc">Newest First</option>
                        <option value="statusPrio">Status Priority</option>
                    </select>
                </div>
            </div>

            {filteredAndSortedOrders.length === 0 ? (
                <p className="text-center text-gray-500">No orders found matching the current filter.</p>
            ) : (
                <div className="space-y-6 max-w-6xl mx-auto">
                    {/* Map over the filtered and sorted orders */}
                    {filteredAndSortedOrders.map((order) => {
                        let statusColor = "bg-gray-200 text-gray-700";
                        if (order.status === 'Processing') statusColor = "bg-yellow-200 text-yellow-800";
                        if (order.status === 'Delivered') statusColor = "bg-green-200 text-green-800";
                        if (order.status === 'Cancelled') statusColor = "bg-red-200 text-red-800";

                        return (
                             <div key={`${order.userId}-${order.originalIndex}`} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                                {/* Display User Info */}
                                <h2 className="text-lg font-semibold mb-2 text-blue-700 border-b pb-1">
                                    User: {order.userName} <span className="text-gray-500 font-normal">({order.userEmail})</span>
                                </h2>

                                {/* Order Details */}
                                <div className="border border-blue-100 rounded-lg p-4 bg-blue-50/30">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                                        <div>
                                            <h3 className="text-md font-medium text-gray-800">Order from User {order.userId.substring(0, 5)}...</h3>
                                            <p className="text-sm text-gray-500">
                                                Placed on: {order.createdAtDate ? order.createdAtDate.toLocaleString() : 'N/A'}
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
                                        <label htmlFor={`status-${order.userId}-${order.originalIndex}`} className="text-sm font-medium text-gray-700">Update Status:</label>
                                        <select
                                            id={`status-${order.userId}-${order.originalIndex}`}
                                            value={order.status || 'Pending'}
                                            // Pass userId, originalIndex, and newStatus
                                            onChange={(e) => handleStatusChange(order.userId, order.originalIndex, e.target.value)}
                                            disabled={isUpdating}
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
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;