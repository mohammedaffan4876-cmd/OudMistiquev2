import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [], total: 0 })

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setCart({ items: [], total: 0 })
    }
  }, [user])

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart/')
      setCart(response.data)
    } catch (error) {
      setCart({ items: [], total: 0 })
    }
  }

  const addToCart = async (productId, quantity = 1, size) => {
    try {
      const response = await api.post('/cart/add/', { product: productId, quantity, size })
      setCart(response.data)
      toast.success('Added to cart')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/item/${itemId}/`, { quantity })
      setCart(response.data)
    } catch (error) {
      toast.error('Failed to update quantity')
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const response = await api.delete(`/cart/item/${itemId}/`)
      setCart(response.data)
      toast.success('Removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}