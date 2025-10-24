"use client"
import Link from "next/link"
import useOrdersStore from "@/stores/useOrders"
import { v4 as uuidv4 } from "uuid"

const StatusBadge = ({ status }) => {
  const baseClasses =
    "px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full capitalize inline-block transition-all"

  const statusClasses = {
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    processing: "bg-blue-50 text-blue-700 border border-blue-200",
    delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border border-red-200",
  }

  const specificClasses = statusClasses[status?.toLowerCase()] || "bg-slate-50 text-slate-700 border border-slate-200"

  return <span className={`${baseClasses} ${specificClasses}`}>{status || "Unknown"}</span>
}

export default function OrdersPage() {
  const { orders } = useOrdersStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-4">
          <Link
            href="/package"
            className="group p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
          >
            <i className="ri-arrow-left-line text-lg sm:text-xl text-slate-600 group-hover:text-slate-900"></i>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">My Orders</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8">
        <div className="space-y-3 sm:space-y-5">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={uuidv4()}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md border border-slate-200/50 overflow-hidden transition-all duration-300"
              >
                <div className="p-3 sm:p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Order Placed</p>
                    <p className="font-bold text-slate-900 text-base sm:text-lg mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                <div className="p-3 sm:p-5 space-y-3 sm:space-y-4 border-b border-slate-200/50">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 last:pb-0 last:border-b-0 border-b border-slate-100"
                    >
                      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg?height=64&width=64&query=product"}
                            alt={item.name}
                            width="64"
                            height="64"
                            className="rounded-lg object-cover border border-slate-200 shadow-sm"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-slate-900 text-sm truncate">{item.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">
                            Qty: <span className="font-medium text-slate-700">{item.quantity}</span>
                          </p>
                          <p className="text-sm font-bold text-indigo-600 mt-1.5">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 sm:p-5 bg-gradient-to-r from-slate-50 to-white flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 text-sm">
                      Shipping to <span className="text-indigo-600 break-words">{order.address.fullName}</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {`${order.address.houseNo}, ${order.address.roadName}`}
                      <br />
                      {`${order.address.city}, ${order.address.state} - ${order.address.pincode}`}
                    </p>
                    <p className="text-xs text-slate-600 mt-2">
                      <span className="font-medium">Phone:</span> {order.address.phone}
                    </p>
                  </div>
                  <div className="text-right sm:text-right flex-shrink-0 w-full sm:w-auto">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Amount</p>
                    <p className="font-bold text-lg sm:text-xl text-slate-900 mt-1">₹{order.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 sm:py-20 px-4">
              <div className="inline-flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-slate-100 mb-3 sm:mb-4">
                <i className="ri-shopping-bag-line text-xl sm:text-2xl text-slate-400"></i>
              </div>
              <p className="text-slate-600 font-medium text-sm sm:text-base">You have no orders yet.</p>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">Start shopping to see your orders here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
