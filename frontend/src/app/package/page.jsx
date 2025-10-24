"use client"
import { useEffect, useState } from "react"
import { getPackageElement } from "@/api/modalApi"
import Navbar from "@/components/Navbar"
import Image from "next/image"
import PackageButton from "@/components/PackageButton"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/config/firebase"
import { useUserStore } from "@/userStore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import useAddressStore from "@/stores/useAddress"
import useCartStore from "@/stores/useCart"
import useOrdersStore from "@/stores/useOrders"

function PackagePage() {
  const [isLoading, setIsLoading] = useState(true)
  const { setCart } = useCartStore.getState()
  const { setUserInfo, clearUserInfo } = useUserStore.getState()
  const { setAddress } = useAddressStore.getState()
  const { setOrders } = useOrdersStore.getState()

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const userData = docSnap.data()
          setUserInfo({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            ...userData,
          })

          setAddress(userData.address || {})
          setCart(userData.cart || [])
          setOrders(userData.order || [])
        } else {
          clearUserInfo()
          setAddress({})
          setCart([])
          setOrders([])
        }
      } else {
        clearUserInfo()
        setAddress({})
        setCart([])
        setOrders([])
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const products = getPackageElement()

  const SkeletonLoader = () => (
    <div className="space-y-4 sm:space-y-5">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 animate-pulse"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-200 to-slate-100 rounded-lg flex-shrink-0" />
          <div className="flex-grow space-y-2">
            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded-md w-3/4" />
            <div className="h-4 bg-gradient-to-r from-slate-100 to-slate-50 rounded-md w-1/2" />
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-100 rounded-full flex-shrink-0" />
        </div>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pb-28 font-sans">
        <Navbar />
        <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <header className="mb-6 md:mb-10 text-center">
            <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg w-3/4 mx-auto mb-4 animate-pulse" />
            <div className="h-5 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg w-1/2 mx-auto animate-pulse" />
          </header>
          <SkeletonLoader />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pb-28 font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <header className="mb-8 md:mb-12 text-center">
          <div className="inline-block mb-3">
            <span className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Complete Package
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 text-balance">
            Fundameter Clinic Package
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto text-balance">
            Everything you need to equip your clinic with professional-grade instruments
          </p>
        </header>

        <div className="space-y-3 sm:space-y-4">
          {products.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-lg border border-slate-100 hover:border-blue-200 transition-all duration-300 ease-in-out flex items-center gap-4 hover:bg-blue-50/30"
            >
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-slate-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src={item.image || "/placeholder.svg?height=80&width=80&query=medical-instrument"}
                  width={80}
                  height={80}
                  alt={item.name || "Package Item"}
                  className="rounded-lg object-cover border border-slate-200 group-hover:border-blue-300 transition-colors duration-300 relative z-10"
                />
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900 truncate">{item.name}</h2>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded whitespace-nowrap">
                    #{index + 1}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Quantity: <span className="font-semibold text-slate-700">{item.unit || 1}</span> unit
                  {item.unit !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex-shrink-0 ml-2">
                
                  <i className="ri-check-line bg-blue-600 text-white text-[12px] font-bold rounded-full p-2" />
               
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 p-5 sm:p-6 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <i className="ri-information-line text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Package Summary</h3>
              <p className="text-sm text-slate-600">
                This complete package includes <span className="font-semibold">{products.length}</span> essential
                instruments to set up your clinic. All items are included and ready for delivery.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PackageButton />
    </div>
  )
}

export default PackagePage
