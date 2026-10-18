import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const loadRazorpay = () => new Promise((resolve, reject) => {
  if (window.Razorpay) {
    resolve(true)
    return
  }

  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = () => resolve(true)
  script.onerror = () => reject(new Error('Could not load Razorpay checkout.'))
  document.body.appendChild(script)
})

export const Checkout = () => {
  const { cart, fetchCart } = useCart()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    payment_method: 'cod',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to checkout')
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (formData.payment_method === 'cod') {
        await api.post('/orders/', {
          ...formData,
          items: cart.items.map(item => ({ product: item.product.id, quantity: item.quantity, size: item.size })),
        })
        await fetchCart()
        toast.success('Order placed successfully!')
        navigate('/order-success')
        return
      }

      const { data: paymentOrder } = await api.post('/razorpay/orders/', formData)
      await loadRazorpay()
      const checkout = new window.Razorpay({
        key: paymentOrder.key_id,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: paymentOrder.name,
        order_id: paymentOrder.razorpay_order_id,
        prefill: { name: formData.full_name, email: formData.email, contact: formData.phone },
        handler: async (paymentResponse) => {
          try {
            await api.post('/razorpay/verify/', {
              order_id: paymentOrder.order_id,
              ...paymentResponse,
            })
            await fetchCart()
            toast.success('Payment successful and order confirmed!')
            navigate('/order-success')
          } catch (error) {
            toast.error('Payment verification is pending. Check your order history before retrying.')
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      })
      checkout.on('payment.failed', () => {
        toast.error('Payment failed. Your cart has not been cleared.')
        setLoading(false)
      })
      checkout.open()
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Could not start checkout.')
      setLoading(false)
    } finally {
      if (formData.payment_method === 'cod') setLoading(false)
    }
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Your cart is empty</h2>
          <button onClick={() => navigate('/shop')} className="gold-gradient text-white px-6 py-2 rounded-full">
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif font-bold text-center mb-12 gold-text-gradient"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 mb-6"
            >
              <h2 className="text-2xl font-serif font-bold mb-6">Shipping Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <textarea
                  placeholder="Full Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />

                <h2 className="text-2xl font-serif font-bold mt-6 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={formData.payment_method === 'cod'}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="w-4 h-4 text-gold-600"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={formData.payment_method === 'razorpay'}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="w-4 h-4 text-gold-600"
                    />
                    <span>Pay online with Razorpay</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gold-gradient text-white py-3 rounded-lg font-medium hover:shadow-lg transition mt-6"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 h-fit"
          >
            <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
               {cart.items.map(item => (
                 <div key={item.id} className="flex justify-between text-sm">
                   <span>{item.product.name} ({item.size}) x {item.quantity}</span>
                   <span>₹{item.price * item.quantity}</span>
                 </div>
               ))}
            </div>

            <div className="border-t border-gold-200 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{cart.subtotal || cart.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="gold-text-gradient">₹{cart.total}</span>
              </div>
            </div>

            {formData.payment_method === 'razorpay' && (
              <p className="mt-6 text-center text-sm text-gray-600">
                Secure payment by card, UPI, netbanking, or wallet through Razorpay.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}