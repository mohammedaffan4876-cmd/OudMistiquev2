import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import api, { getImageUrl } from '../services/api'
import toast from 'react-hot-toast'

export const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(null)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}/`)
      setProduct(response.data)
    } catch (error) {
      navigate('/shop')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }
    if (!selectedSize) {
      toast.error('Please select a size first')
      return
    }
    if (product) {
      addToCart(product.id, quantity, selectedSize)
    }
  }

  const handleWishlist = () => {
    if (!user) {
      toast.error('Please login to manage your wishlist')
      navigate('/login')
      return
    }
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id)
      } else {
        addToWishlist(product.id)
      }
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!product) return null

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8"
          >
              <div className="aspect-square bg-gradient-to-br from-gold-100 to-cream-200 rounded-xl flex items-center justify-center">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-4/5 h-4/5 object-cover"
                />
              </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8"
          >
             <h1 className="text-4xl font-serif font-bold gold-text-gradient mb-4">{product.name}</h1>
             <p className="text-3xl font-bold text-gold-600 mb-6">
               ₹{selectedSize ? getPriceForSize(selectedSize) : (product.perfume_price_30ml || product.perfume_price_20ml || product.attar_price_6ml || product.price)}
               {!selectedSize && <span className="text-xs text-gray-500 font-sans font-normal ml-2">Starting Price</span>}
               {selectedSize && <span className="text-xs text-gold-100 font-sans font-normal ml-2">({selectedSize})</span>}
             </p>
             
             <div className="mb-6">
               <p className="text-gray-600 leading-relaxed">{product.description}</p>
             </div>

             {product.fragrance_notes && (
               <div className="mb-6 font-sans">
                 <h4 className="text-xs font-bold text-gold-700 uppercase tracking-wider mb-2">Fragrance Notes</h4>
                 <p className="text-sm text-gray-600 italic bg-gold-50/30 border border-gold-200/20 rounded-xl p-4">{product.fragrance_notes}</p>
               </div>
             )}
              {/* Dynamic Pricing Info */}
              <div className="mb-6 border-t border-b border-gold-200/30 py-4 font-sans">
                <h3 className="font-serif font-bold text-gray-800 text-lg mb-3">Available Options & Pricing</h3>
                
                {/* Attar Options */}
                {(parseFloat(product.attar_price_6ml) > 0 || parseFloat(product.attar_price_12ml) > 0) && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gold-700 uppercase tracking-wider mb-2">Concentrated Perfume Oil (Attar)</h4>
                    <div className="flex gap-4">
                      {parseFloat(product.attar_price_6ml) > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedSize('6ml')}
                          className={`border rounded-xl px-4 py-2 text-center flex-1 transition-all duration-200 ${
                            selectedSize === '6ml'
                              ? 'bg-gold-500 text-white border-gold-500 shadow-md scale-102 font-semibold'
                              : 'bg-cream-100/40 border-gold-200/50 text-gray-900 hover:bg-gold-50/50'
                          }`}
                        >
                          <p className={`text-xs ${selectedSize === '6ml' ? 'text-gold-100' : 'text-gray-500'}`}>6ml</p>
                          <p className="text-sm font-bold">₹{product.attar_price_6ml}</p>
                        </button>
                      )}
                      {parseFloat(product.attar_price_12ml) > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedSize('12ml')}
                          className={`border rounded-xl px-4 py-2 text-center flex-1 transition-all duration-200 ${
                            selectedSize === '12ml'
                              ? 'bg-gold-500 text-white border-gold-500 shadow-md scale-102 font-semibold'
                              : 'bg-cream-100/40 border-gold-200/50 text-gray-900 hover:bg-gold-50/50'
                          }`}
                        >
                          <p className={`text-xs ${selectedSize === '12ml' ? 'text-gold-100' : 'text-gray-500'}`}>12ml</p>
                          <p className="text-sm font-bold">₹{product.attar_price_12ml}</p>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Perfume Options */}
                {(parseFloat(product.perfume_price_20ml) > 0 || parseFloat(product.perfume_price_30ml) > 0 || parseFloat(product.perfume_price_50ml) > 0) && (
                  <div>
                    <h4 className="text-xs font-bold text-gold-700 uppercase tracking-wider mb-2">Eau de Parfum (Spray)</h4>
                    <div className="flex gap-4">
                      {parseFloat(product.perfume_price_20ml) > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedSize('20ml')}
                          className={`border rounded-xl px-4 py-2 text-center flex-1 transition-all duration-200 ${
                            selectedSize === '20ml'
                              ? 'bg-gold-500 text-white border-gold-500 shadow-md scale-102 font-semibold'
                              : 'bg-cream-100/40 border-gold-200/50 text-gray-900 hover:bg-gold-50/50'
                          }`}
                        >
                          <p className={`text-xs ${selectedSize === '20ml' ? 'text-gold-100' : 'text-gray-500'}`}>20ml</p>
                          <p className="text-sm font-bold">₹{product.perfume_price_20ml}</p>
                        </button>
                      )}
                      {parseFloat(product.perfume_price_30ml) > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedSize('30ml')}
                          className={`border rounded-xl px-4 py-2 text-center flex-1 transition-all duration-200 ${
                            selectedSize === '30ml'
                              ? 'bg-gold-500 text-white border-gold-500 shadow-md scale-102 font-semibold'
                              : 'bg-cream-100/40 border-gold-200/50 text-gray-900 hover:bg-gold-50/50'
                          }`}
                        >
                          <p className={`text-xs ${selectedSize === '30ml' ? 'text-gold-100' : 'text-gray-500'}`}>30ml</p>
                          <p className="text-sm font-bold">₹{product.perfume_price_30ml}</p>
                        </button>
                      )}
                      {parseFloat(product.perfume_price_50ml) > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedSize('50ml')}
                          className={`border rounded-xl px-4 py-2 text-center flex-1 transition-all duration-200 ${
                            selectedSize === '50ml'
                              ? 'bg-gold-500 text-white border-gold-500 shadow-md scale-102 font-semibold'
                              : 'bg-cream-100/40 border-gold-200/50 text-gray-900 hover:bg-gold-50/50'
                          }`}
                        >
                          <p className={`text-xs ${selectedSize === '50ml' ? 'text-gold-100' : 'text-gray-500'}`}>50ml</p>
                          <p className="text-sm font-bold">₹{product.perfume_price_50ml}</p>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

             <div className="mb-6">
               <span className="inline-block px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-sm capitalize">
                 {product.category?.name || 'Fragrance'} Perfume
               </span>
             </div>

            <div className="flex items-center space-x-4 mb-8">
              <span className="text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gold-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-600 hover:text-gold-600"
                >
                  <FiMinus />
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-600 hover:text-gold-600"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 gold-gradient text-white py-3 rounded-lg font-medium hover:shadow-lg transition flex items-center justify-center"
              >
                <FiShoppingCart className="mr-2" />
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`p-3 rounded-lg border border-gold-300 transition ${
                  isInWishlist(product.id) ? 'bg-gold-100 text-gold-700' : 'text-gray-600 hover:text-gold-600'
                }`}
              >
                <FiHeart className={isInWishlist(product.id) ? 'fill-current' : ''} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}