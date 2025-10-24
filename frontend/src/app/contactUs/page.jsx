"use client"
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from "react-icons/fa"

function ContactUs() {
  const phoneNumber = "+919546941801"
  const whatsappNumber = "919546941801"
  const emailAddress = "support@fundameter.com"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Main Container */}
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 text-balance">Get in Touch</h1>
          <p className="text-lg sm:text-xl text-slate-600 text-balance">
            We're here to help. Choose your preferred way to reach us.
          </p>
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 sm:p-10 lg:p-12 space-y-8">
          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=Hello%20Fundameter,%20I%20have%20a%20question.`}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full flex items-center justify-center px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-base sm:text-lg rounded-xl transition-all duration-300 ease-out shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaWhatsapp className="mr-3 h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            <span>Chat via WhatsApp</span>
          </a>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-sm text-slate-500 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Phone Button */}
          <a
            href={`tel:${phoneNumber}`}
            className="group w-full flex items-center justify-center px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-base sm:text-lg rounded-xl transition-all duration-300 ease-out shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaPhoneAlt className="mr-3 h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            <span>Call Us</span>
          </a>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-sm text-slate-500 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Email Section */}
          <div className="text-center space-y-3">
            <p className="text-slate-600 font-medium text-base sm:text-lg">Send us an email</p>
            <a
              href={`mailto:${emailAddress}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl transition-all duration-300 ease-out"
            >
              <FaEnvelope className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm sm:text-base">{emailAddress}</span>
            </a>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-slate-600 text-sm sm:text-base">
            We typically respond within <span className="font-semibold text-slate-900">24 hours</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
