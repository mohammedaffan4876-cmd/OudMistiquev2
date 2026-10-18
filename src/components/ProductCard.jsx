import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiEye, FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { QuickViewModal } from './QuickViewModal'
import { getImageUrl } from '../services/api'
import toast from 'react-hot-toast'

const temporaryProductImages = [
  '/images/hero_oud_mistique.png',
  '/images/hero_french_scent.png',
  '/images/hero_luxury_attar.png',
  '/images/luxury_attar_hero.png',
]

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const temporaryImage = temporaryProductImages[(Number(product.id) || 0) % temporaryProductImages.length]

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsQuickViewOpen(true)
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsQuickViewOpen(true)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error('Please login to manage your wishlist')
      navigate('/login')
      return
    }
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product.id)
    }
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsQuickViewOpen(true)
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        className="glass-card overflow-hidden group border border-gold-200/30 relative flex flex-col justify-between h-full hover:border-gold-400/60 hover:bg-gold-50/5 transition duration-300 shadow-[0_4px_25px_rgba(212,175,55,0.03)] hover:shadow-[0_12px_30px_rgba(212,175,55,0.1)]"
      >
        <Link to={`/product/${product.id}`} className="block relative flex-grow min-w-0">
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-4 right-4 z-10 p-2.5 rounded-full border border-gold-200/50 backdrop-blur-md transition-all duration-300 cursor-pointer ${
              isInWishlist(product.id)
                ? 'bg-gold-500 text-white border-gold-500'
                : 'bg-white/70 text-gray-600 hover:text-gold-600 hover:bg-white'
            }`}
          >
            <FiHeart className={isInWishlist(product.id) ? 'fill-current' : ''} size={16} />
          </button>

          {/* Category Badge */}
          <span className="absolute top-4 left-4 z-10 max-w-[calc(100%-5rem)] truncate text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-gold-200/40 text-gold-800 uppercase tracking-widest">
            {product.category?.name || 'Fragrance'}
          </span>

          {/* Product Image Area */}
          <div className="h-64 sm:h-72 bg-gradient-to-br from-gold-50 to-cream-100 flex items-center justify-center p-6 relative overflow-hidden group-hover:from-gold-100/70 group-hover:to-cream-200/70 transition duration-500">
            {/* Premium Inner Frame */}
            <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full border border-gold-200/40 bg-white/75 flex items-center justify-center p-4 relative overflow-hidden shadow-inner group-hover:border-gold-300/80 transition duration-500">
              <img
                src={product.image ? getImageUrl(product.image) : temporaryImage}
                alt={product.name}
                className="w-[85%] h-[85%] object-contain rounded-full transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = temporaryImage
                }}
              />
            </div>
            {/* Overlay Quick View Button */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
              <button
                onClick={handleQuickView}
                className="bg-white/90 backdrop-blur-md border border-gold-300 text-gold-800 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:bg-gold-500 hover:text-white hover:border-gold-500 hover:scale-105"
              >
                <FiEye size={14} />
                Quick View
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-5 flex flex-col justify-between flex-grow">
            <div>
              {/* Star Rating */}
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-gold-500 text-xs">★</span>
                ))}
                <span className="text-[10px] text-gray-500 font-medium font-sans pl-0.5">(4.9)</span>
              </div>

              {/* Title */}
              <h3 className="font-serif font-bold text-gray-900 text-lg group-hover:text-gold-600 transition duration-300 line-clamp-1 mb-1 tracking-wide">
                {product.name}
              </h3>

              {/* Fragrance notes snippet */}
              <p className="text-xs text-gray-500 font-serif italic line-clamp-1 mb-2.5">
                {product.fragrance_notes || 'Top, Middle, and Base notes.'}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline justify-between gap-2 mt-auto min-w-0">
              <p className="text-lg font-bold gold-text-gradient truncate">
                ₹{product.perfume_price_30ml || product.perfume_price_20ml || product.attar_price_6ml || product.price}
              </p>
              <span className="text-[10px] text-gray-400 font-sans tracking-wide text-right shrink-0">
                {product.perfume_price_30ml ? '30ml / Perfume' : product.perfume_price_20ml ? '20ml / Perfume' : product.attar_price_6ml ? '6ml / Attar' : 'Luxury Scent'}
              </span>
            </div>

            {/* Sizing & Pricing Capsules */}
            <div className="mt-3 pt-3 border-t border-gold-200/20 flex flex-wrap gap-1 justify-start font-sans">
              {parseFloat(product.attar_price_6ml) > 0 && (
                <span className="text-[8px] bg-gold-50/50 text-gold-800 border border-gold-200/30 px-1.5 py-0.5 rounded-full font-medium">
                  6ml: ₹{product.attar_price_6ml}
                </span>
              )}
              {parseFloat(product.attar_price_12ml) > 0 && (
                <span className="text-[8px] bg-gold-50/50 text-gold-800 border border-gold-200/30 px-1.5 py-0.5 rounded-full font-medium">
                  12ml: ₹{product.attar_price_12ml}
                </span>
              )}
              {parseFloat(product.perfume_price_20ml) > 0 && (
                <span className="text-[8px] bg-cream-100/40 text-gray-700 border border-gold-200/20 px-1.5 py-0.5 rounded-full font-medium">
                  20ml: ₹{product.perfume_price_20ml}
                </span>
              )}
              {parseFloat(product.perfume_price_30ml) > 0 && (
                <span className="text-[8px] bg-cream-100/40 text-gray-700 border border-gold-200/20 px-1.5 py-0.5 rounded-full font-medium">
                  30ml: ₹{product.perfume_price_30ml}
                </span>
              )}
              {parseFloat(product.perfume_price_50ml) > 0 && (
                <span className="text-[8px] bg-cream-100/40 text-gray-700 border border-gold-200/20 px-1.5 py-0.5 rounded-full font-medium">
                  50ml: ₹{product.perfume_price_50ml}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Action Buttons Footer */}
        <div className="px-5 pb-5 pt-0 grid grid-cols-2 gap-3 border-t border-gold-200/20 mt-2">
          <button
            onClick={handleAddToCart}
            className="bg-white hover:bg-gold-50 text-gold-800 border border-gold-200 py-2.5 rounded-full text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiShoppingCart size={13} />
            Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="gold-gradient text-white py-2.5 rounded-full text-xs font-medium hover:shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiShoppingBag size={13} />
            Buy Now
          </button>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  )
}
export default ProductCard
