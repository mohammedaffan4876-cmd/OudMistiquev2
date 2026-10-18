import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    if (user) {
      fetchWishlist()
    } else {
      setWishlist([])
    }
  }, [user])

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist/')
      setWishlist(response.data)
    } catch (error) {
      setWishlist([])
    }
  }

  const addToWishlist = async (productId) => {
    try {
      await api.post('/wishlist/add/', { product: productId })
      fetchWishlist()
      toast.success('Added to wishlist')
    } catch (error) {
      toast.error('Failed to add to wishlist')
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}/`)
      setWishlist(wishlist.filter(item => item.product.id !== productId))
      toast.success('Removed from wishlist')
    } catch (error) {
      toast.error('Failed to remove from wishlist')
    }
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product.id === productId)
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}