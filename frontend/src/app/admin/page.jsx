'use client'
import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'; // Import useRouter
import useAdminStore from '@/stores/useAdmin';

function Admin() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State for error messages
    const router = useRouter(); // Initialize router

    const {setIsAdmin , isAdmin} = useAdminStore();

    const user = "admin"; // Ideally, move these to environment variables
    const pass = "admin123";

    const handleLogin = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (userName === user && password === pass) {
            console.log("Login successful");
            // Set a flag in localStorage or session storage to indicate login
            localStorage.setItem('isAdminAuthenticated', 'true');
            // Redirect to the admin dashboard
            setIsAdmin(true);
            router.push('/admin/dashboard');
        } else {
            setError("Invalid username or password."); // Set a user-friendly error message
        }
    }

    return (
        // Main container: full screen height, flexbox centering, light gray background
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-3">
            {/* Login card: white background, padding, rounded corners, shadow */}
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                {/* Title */}
                <h1 className="text-2xl font-bold text-center text-gray-800">Admin Portal</h1>
                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Username Input */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required // Add required attribute
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {/* Password Input */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required // Add required attribute
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Error Message Display */}
                    {error && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Admin;

