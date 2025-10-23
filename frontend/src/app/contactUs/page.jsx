'use client'; // This component uses event handlers (links), so it's a Client Component

import React from 'react';
// Import icons (example using react-icons, install if needed: npm install react-icons)
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function ContactUs() {
  // --- REPLACE WITH YOUR ACTUAL CONTACT DETAILS ---
  const phoneNumber = '+919546941801'; // Example Indian number
  const whatsappNumber = '919546941801'; // WhatsApp uses number without '+' but with country code
  const emailAddress = 'support@fundameter.com';
  // --- END OF CONTACT DETAILS ---

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hello%20Medikart,%20I%20have%20a%20question.`; // Pre-filled message
  const phoneLink = `tel:${phoneNumber}`;

  return (
    // Outer container: Ensures full height, centers content vertically and horizontally
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Contact Card: Made wider using max-w-3xl, retains vertical centering */}
      <div className="max-w-3xl w-full space-y-10 p-10 bg-white rounded-2xl shadow-xl">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-gray-900">
            Contact Us
          </h2>
          <p className="mt-3 text-center text-md text-gray-600">
            Need help? Choose your preferred contact method below.
          </p>
        </div>

        {/* Contact Actions: Increased spacing between buttons */}
        <div className="space-y-6">
          {/* WhatsApp Button */}
          <a
            href={"https://wa.me/919546941801"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition duration-150 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <FaWhatsapp className="mr-3 -ml-1 h-6 w-6" aria-hidden="true" />
            Chat via WhatsApp
          </a>

          {/* Phone Call Button */}
          <a
            href={"tel:919546941801"}
            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <FaPhoneAlt className="mr-3 -ml-1 h-5 w-5" aria-hidden="true" />
            Call Us
          </a>

          {/* Email Link */}
          <div className="text-center pt-4">
             <p className="text-md text-gray-600">Or email us at:</p>
             <a href={`mailto:${emailAddress}`} className="font-medium text-blue-600 hover:text-blue-500 text-lg">
               {emailAddress}
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;

