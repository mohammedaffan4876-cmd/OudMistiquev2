import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { getImageUrl } from '../services/api'

export const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (cart.items?.length > 0) {
      navigate('/checkout')
    }
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FiShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-serif font-bold mb-4">Your Cart is Empty</h2>
          <Link to="/shop" className="gold-gradient text-white px-6 py-2 rounded-full inline-block">
            Continue Shopping
          </Link>
        </motion.div>
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
          Shopping Cart
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4 flex items-center space-x-4"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-gold-100 to-cream-200 rounded-lg flex-shrink-0">
                  <img
                    src={getImageUrl(item.product.image)}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-serif font-semibold text-lg">{item.product.name}</h3>
                  {item.size && <p className="text-xs text-gray-500 font-sans mb-1">Size: {item.size}</p>}
                  <p className="text-gold-600 font-bold">₹{item.price}</p>
                </div>

                <div className="flex items-center border border-gold-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="p-2 text-gray-600 hover:text-gold-600"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-4 py-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 text-gray-600 hover:text-gold-600"
                  >
                    <FiPlus />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 h-fit"
          >
            <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{cart.subtotal || cart.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t border-gold-200 pt-3 flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold gold-text-gradient">₹{cart.total}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full gold-gradient text-white py-3 rounded-lg font-medium hover:shadow-lg transition"
            >
              Proceed to Checkout
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}