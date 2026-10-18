import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiShoppingCart, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getImageUrl } from '../services/api'
import toast from 'react-hot-toast'

export const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(null)

  if (!product) return null

  const getPriceForSize = (size) => {
    if (!product) return 0
    switch(size) {
      case '6ml': return parseFloat(product.attar_price_6ml)
      case '12ml': return parseFloat(product.attar_price_12ml)
      case '20ml': return parseFloat(product.perfume_price_20ml)
      case '30ml': return parseFloat(product.perfume_price_30ml)
      case '50ml': return parseFloat(product.perfume_price_50ml)
      default: return 0
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      onClose()
      return
    }
    if (!selectedSize) {
      toast.error('Please select a size first')
      return
    }
    addToCart(product.id, quantity, selectedSize)
    onClose()
  }

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to checkout')
      navigate('/login')
      onClose()
      return
    }
    if (!selectedSize) {
      toast.error('Please select a size first')
      return
    }
    addToCart(product.id, quantity, selectedSize)
    navigate('/checkout')
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white/90 backdrop-blur-xl border border-gold-200/50 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gold-600 transition p-2 bg-gray-100 rounded-full cursor-pointer z-20"
          >
            <FiX size={20} />
          </button>

          {/* Left: Product Image */}
          <div className="aspect-square bg-gradient-to-br from-gold-50 to-cream-100 rounded-2xl flex items-center justify-center p-6 border border-gold-100">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-4/5 h-4/5 object-cover hover:scale-105 transition duration-500"
            />
          </div>

          {/* Right: Product details */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gold-100 text-gold-800 uppercase tracking-wider mb-3 inline-block">
                {product.category?.name || 'Fragrance'}
              </span>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">{product.name}</h2>
              
              {/* Stars */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-gold-500 text-lg">★</span>
                ))}
                <span className="text-xs text-gray-500 font-medium pl-1">(4.9/5)</span>
              </div>

              <p className="text-2xl font-bold gold-text-gradient mb-4">
                ₹{selectedSize ? getPriceForSize(selectedSize) : (product.perfume_price_30ml || product.perfume_price_20ml || product.attar_price_6ml || product.price)}
                {!selectedSize && <span className="text-xs text-gray-500 font-sans font-normal ml-2">Starting Price</span>}
                {selectedSize && <span className="text-xs text-gold-100 font-sans font-normal ml-2">({selectedSize})</span>}
              </p>

              {/* Dynamic Pricing / Size Selection */}
              <div className="mb-4 border-t border-b border-gold-200/30 py-2.5 font-sans">
                <p className="font-bold text-gray-800 text-xs mb-2">Select Size & Option:</p>
                <div className="space-y-3">
                  {(parseFloat(product.attar_price_6ml) > 0 || parseFloat(product.attar_price_12ml) > 0) && (
                    <div>
                      <span className="text-[10px] font-bold text-gold-700 uppercase block mb-1">Attar Options</span>
                      <div className="flex gap-2">
                        {parseFloat(product.attar_price_6ml) > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedSize('6ml')}
                            className={`border rounded-lg py-1 px-3 text-center flex-1 transition-all duration-200 text-xs ${
                              selectedSize === '6ml'
                                ? 'bg-gold-500 text-white border-gold-500 font-semibold shadow-sm'
                                : 'bg-cream-100/40 border-gold-200/30 text-gray-900 hover:bg-gold-50/50'
                            }`}
                          >
                            6ml - ₹{product.attar_price_6ml}
                          </button>
                        )}
                        {parseFloat(product.attar_price_12ml) > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedSize('12ml')}
                            className={`border rounded-lg py-1 px-3 text-center flex-1 transition-all duration-200 text-xs ${
                              selectedSize === '12ml'
                                ? 'bg-gold-500 text-white border-gold-500 font-semibold shadow-sm'
                                : 'bg-cream-100/40 border-gold-200/30 text-gray-900 hover:bg-gold-50/50'
                            }`}
                          >
                            12ml - ₹{product.attar_price_12ml}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {(parseFloat(product.perfume_price_20ml) > 0 || parseFloat(product.perfume_price_30ml) > 0 || parseFloat(product.perfume_price_50ml) > 0) && (
                    <div>
                      <span className="text-[10px] font-bold text-gold-700 uppercase block mb-1">Perfume Options</span>
                      <div className="flex flex-wrap gap-2">
                        {parseFloat(product.perfume_price_20ml) > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedSize('20ml')}
                            className={`border rounded-lg py-1 px-3 text-center flex-grow transition-all duration-200 text-xs ${
                              selectedSize === '20ml'
                                ? 'bg-gold-500 text-white border-gold-500 font-semibold shadow-sm'
                                : 'bg-cream-100/40 border-gold-200/30 text-gray-900 hover:bg-gold-50/50'
                            }`}
                          >
                            20ml - ₹{product.perfume_price_20ml}
                          </button>
                        )}
                        {parseFloat(product.perfume_price_30ml) > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedSize('30ml')}
                            className={`border rounded-lg py-1 px-3 text-center flex-grow transition-all duration-200 text-xs ${
                              selectedSize === '30ml'
                                ? 'bg-gold-500 text-white border-gold-500 font-semibold shadow-sm'
                                : 'bg-cream-100/40 border-gold-200/30 text-gray-900 hover:bg-gold-50/50'
                            }`}
                          >
                            30ml - ₹{product.perfume_price_30ml}
                          </button>
                        )}
                        {parseFloat(product.perfume_price_50ml) > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedSize('50ml')}
                            className={`border rounded-lg py-1 px-3 text-center flex-grow transition-all duration-200 text-xs ${
                              selectedSize === '50ml'
                                ? 'bg-gold-500 text-white border-gold-500 font-semibold shadow-sm'
                                : 'bg-cream-100/40 border-gold-200/30 text-gray-900 hover:bg-gold-50/50'
                            }`}
                          >
                            50ml - ₹{product.perfume_price_50ml}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-xs font-bold text-gold-700 uppercase tracking-widest mb-1 font-sans">Notes</p>
                <p className="text-sm text-gray-600 italic font-serif">{product.fragrance_notes || 'Top, Middle, and Base notes.'}</p>
              </div>

              <div className="mb-6">
                <p className="text-xs font-bold text-gold-700 uppercase tracking-widest mb-1 font-sans">Description</p>
                <p className="text-sm text-gray-600 leading-relaxed font-sans line-clamp-4">{product.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Quantity Counter */}
              <div className="flex items-center justify-between border-t border-b border-gold-100 py-3">
                <span className="text-sm font-medium text-gray-600">Quantity</span>
                <div className="flex items-center border border-gold-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-gray-600 hover:text-gold-600 cursor-pointer"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-4 py-1 text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-gray-600 hover:text-gold-600 cursor-pointer"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white border border-gold-300 hover:bg-gold-50 text-gold-700 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <FiShoppingCart />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full gold-gradient text-white py-3 rounded-xl font-medium hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiShoppingBag />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
export default QuickViewModal
