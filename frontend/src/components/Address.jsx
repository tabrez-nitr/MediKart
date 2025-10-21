'use client';
import React, { useState } from 'react';
import useAddressStore from '@/stores/useAddress';
import { useUserStore } from '@/userStore';

// List of Indian States and Union Territories (remains the same)
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", 
  "Ladakh", "Lakshadweep", "Puducherry"
];

// Reusable Input component (remains the same)
const InputField = ({ id, label, value, onChange, placeholder, type = 'text', required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
        />
    </div>
);

// --- MODIFIED COMPONENT ---
// It now accepts `isOpen` and `onClose` as props
export default function AddressModal({ isOpen, onClose, onSave }) {
    
    const { setAddress, saveAddressToFirebase } = useAddressStore();
    const { uid } = useUserStore();

    // Internal state for form and error remains
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        pincode: '',
        state: '',
        city: '',
        houseNo: '',
        roadName: ''
    });
    const [error, setError] = useState('');

    // This internal function wraps the prop to also clear errors
    const handleClose = () => {
        setError(''); // Clear any errors when closing
        onClose();    // Call the parent's function to close
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple validation check
        for (const key in formData) {
            if (formData[key].trim() === '') {
                setError(`'${key.replace(/([A-Z])/g, ' $1')}' is a required field.`);
                return;
            }
        }
        setError('');
        console.log('Address Submitted:', formData);
        
        if (onSave) {
            onSave(formData);
        }
        
        // 1. Set address in Zustand store
        setAddress(formData);
        
        // 2. Save to Firebase (it gets the address from the store)
        if (uid) {
            saveAddressToFirebase(formData,uid);
        } else {
            console.error("No UID found to save address");
            setError("Could not save address: User not found.");
            return; // Don't close if save failed
        }
       
        handleClose(); // Call internal close function on success
    };

    // --- If the modal is not set to be open, render nothing. ---
    if (!isOpen) {
        return null;
    }

    return (
        // The outer button has been removed.
        // The modal is now wrapped in the backdrop.
        <div className="fixed px-2 inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out backdrop-blur-sm">
            {/* Modal container */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out scale-100 opacity-100">
                <div className="flex justify-between items-center p-5 border-b">
                    <div className="flex items-center gap-3">
                        <i className="ri-map-pin-2-line text-2xl text-indigo-600"></i>
                        <h2 className="text-xl font-bold text-gray-800">Add a new address</h2>
                    </div>
                    {/* Use the new handleClose function */}
                    <button onClick={handleClose} className="text-gray-500 text-2xl hover:text-gray-900">&times;</button>
                </div>

                {/* Modal Body with Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <InputField id="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField id="phone" label="Phone Number" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile number" type="tel" />
                        <InputField id="pincode" label="Pincode" value={formData.pincode} onChange={handleChange} placeholder="6-digit pincode" type="number" />
                    </div>
                    
                    <InputField id="city" label="City/District/Town" value={formData.city} onChange={handleChange} placeholder="e.g. Mumbai" />
                    
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State
                        </label>
                        <select
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="" disabled>Select your state</option>
                            {indianStates.map(stateName => (
                                <option key={stateName} value={stateName}>
                                    {stateName}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <InputField id="houseNo" label="House No., Building, Company, Apartment" value={formData.houseNo} onChange={handleChange} placeholder="" />
                    <InputField id="roadName" label="Road name, Area, Colony, Village" value={formData.roadName} onChange={handleChange} placeholder="" />
                    
                    {error && (
                        <div className="flex items-center gap-2 p-3 mt-2 bg-red-50 text-red-800 rounded-lg">
                            <i className="ri-error-warning-line"></i>
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}
                </form>
                
                {/* Modal Footer */}
                <div className="flex justify-end p-5 border-t bg-gray-50 rounded-b-xl">
                    <button
                        type="submit" // This tells the form to submit
                        onClick={handleSubmit} // Triggers submit logic
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                    >
                        <i className="ri-save-3-line"></i>
                        Save Address
                    </button>
                </div>
            </div>
        </div>
    );
}