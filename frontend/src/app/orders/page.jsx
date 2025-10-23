'use client';
import React from 'react';
import Link from 'next/link';
import useOrdersStore from '@/stores/useOrders';
import { v4 as uuidv4 } from 'uuid';

// I moved status and total to the parent order object, as this is a more common structure.
// The item's total is now just its price * quantity.
// const orders = [
//   {
//     id: 'order_1', // Added an ID for the key
//     createdAt: '2025-10-21T08:58:15.711Z',
//     status: 'pending', // Moved from item
//     total: 1040, // Moved from item
//     address: {
//       city: 'Rourkela',
//       fullName: 'Sams Tabrez',
//       houseNo: 'sJfn',
//       phone: '07846940025',
//       pincode: '770036',
//       roadName: ',koiugyhjkl',
//       state: 'Odisha',
//     },
//     items: [
//       {
//         id: 20002,
//         image: '/fundameterPackage.png',
//         name: 'Fundameter Package',
//         price: 1000,
//         quantity: 1,
//         unit: null,
//         payment: 'COD',
//       },
//       // You could add more items here if an order had them
//     ],
//   },
// ];

// A reusable badge component for the order status
const StatusBadge = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full capitalize';
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return (
    <span
      className={`${baseClasses} ${
        statusClasses[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  );
};

export default function OrdersPage() {

    const {orders} = useOrdersStore();

    console.log(orders);
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="p-4 flex items-center gap-[30%] border-b bg-white shadow-sm">
        <Link href="/package">
          <i className="ri-arrow-left-line text-2xl text-gray-700 hover:text-indigo-600"></i>
        </Link>
        <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
      </div>

      {/* Orders List */}
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={uuidv4()} // Use a stable ID from your data
                className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg"
              >
                {/* Order Header */}
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Order Placed</p>
                    <p className="font-semibold text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Order Items */}
                <div className="p-4 space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id} // Use the item's unique ID for the key
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          width="80"
                          height="80"
                          className="rounded-lg object-cover border"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-bold text-indigo-600">
                            ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition">
                        Track Order
                      </button>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-700">
                      Shipping to {order.address.fullName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {`${order.address.houseNo}, ${order.address.roadName}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Phone: {order.address.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold text-lg text-gray-800">
                      ₹{order.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">You have no orders yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}