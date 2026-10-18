import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiShoppingBag } from 'react-icons/fi'

export const OrderSuccess = () => {
  return (
    <div className="min-h-screen py-20 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <FiCheckCircle size={80} className="mx-auto text-green-500 mb-6" />
        </motion.div>
        
        <h2 className="text-3xl font-serif font-bold mb-4 gold-text-gradient">
          Order Placed Successfully!
        </h2>
        
        <p className="text-gray-600 mb-8">
          Thank you for your order. We will contact you shortly for delivery confirmation.
        </p>

        <div className="space-y-3">
          <Link
            to="/shop"
            className="w-full gold-gradient text-white py-3 rounded-lg font-medium hover:shadow-lg transition flex items-center justify-center"
          >
            Continue Shopping
            <FiShoppingBag className="ml-2" />
          </Link>
          
          <Link
            to="/"
            className="w-full bg-white/50 text-gray-700 py-3 rounded-lg font-medium hover:bg-white/70 transition"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}