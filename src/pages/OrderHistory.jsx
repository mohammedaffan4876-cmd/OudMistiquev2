import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiTruck, FiCreditCard, FiCalendar } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import api, { getImageUrl } from '../services/api'
import toast from 'react-hot-toast'

export const OrderHistory = () => {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to view order history')
      navigate('/login')
      return
    }

    if (user) {
      fetchOrders()
    }
  }, [user, authLoading, navigate])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/')
      setOrders(response.data)
    } catch (error) {
      toast.error('Failed to load order history')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md glass-card p-12"
        >
          <FiShoppingBag size={64} className="mx-auto text-gold-300 mb-4" />
          <h2 className="text-2xl font-serif font-bold mb-4">No Orders Found</h2>
          <p className="text-gray-600 mb-8">You haven't placed any orders yet. Explore our luxury fragrances and place your first order!</p>
          <Link to="/shop" className="gold-gradient text-white px-6 py-3 rounded-full inline-block font-medium hover:shadow-lg transition">
            Start Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-cream-50">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif font-bold text-center mb-12 gold-text-gradient"
        >
          Your Order History
        </motion.h1>

        <div className="space-y-8">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden border border-gold-200"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-gold-50 to-cream-100 p-6 border-b border-gold-200 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Order ID</p>
                  <p className="text-lg font-serif font-bold text-gray-800">#{order.id}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-gold-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Placed On</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Amount</p>
                  <p className="text-lg font-bold gold-text-gradient">₹{order.total}</p>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Items List */}
                  <div className="space-y-4">
                    <h3 className="font-serif font-semibold text-gray-800 mb-2">Items Ordered</h3>
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-gold-50 to-cream-100 rounded-lg flex-shrink-0 flex items-center justify-center p-2 border border-gold-100">
                          <img
                            src={getImageUrl(item.product?.image)}
                            alt={item.product?.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.product?.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} x ₹{item.price}
                          </p>
                        </div>
                        <div className="text-sm font-bold text-gray-700">
                          ₹{item.quantity * item.price}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Shipping Info */}
                  <div className="space-y-4 bg-white/40 p-4 rounded-xl border border-gold-100">
                    <h3 className="font-serif font-semibold text-gray-800 flex items-center">
                      <FiTruck className="mr-2 text-gold-600" /> Shipping Details
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-800">{order.full_name}</p>
                      <p>{order.address}</p>
                      <p>{order.city}, {order.state} - {order.pincode}</p>
                      <p className="pt-1">Phone: {order.phone}</p>
                    </div>

                    <div className="pt-4 border-t border-gold-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center">
                        <FiCreditCard className="mr-1.5 text-gold-600" /> Payment
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gold-100 text-gold-800 uppercase">
                        {order.payment_method === 'cod'
                          ? 'Cash on Delivery'
                          : `Razorpay: ${order.payment_status}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
