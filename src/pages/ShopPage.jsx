import { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter } from 'react-icons/fi'
import api from '../services/api'
import { ProductCard } from '../components/ProductCard'

export const ShopPage = () => {
  const { category } = useParams()
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    category: category || '',
    fragranceType: '',
    featuredOnly: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const searchVal = queryParams.get('search') || ''
    setFilters((prev) => ({
      ...prev,
      category: category || '',
      search: searchVal,
    }))
  }, [category, location.search])

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.minPrice) params.append('min_price', filters.minPrice)
      if (filters.maxPrice) params.append('max_price', filters.maxPrice)
      if (filters.category) params.append('category', filters.category)
      
      const response = await api.get(`/products/?${params}`)
      setProducts(response.data.results || response.data)
    } catch (error) {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Apply frontend dynamic filters
  const filteredProducts = products.filter(product => {
    // 1. Featured Filter
    if (filters.featuredOnly && !product.featured) {
      return false
    }

    // 2. Fragrance Type Filter (checks keywords inside notes or description)
    if (filters.fragranceType) {
      const notes = (product.fragrance_notes || '').toLowerCase()
      const desc = (product.description || '').toLowerCase()
      const type = filters.fragranceType.toLowerCase()

      if (type === 'woody') {
        const keywords = ['wood', 'oud', 'cedar', 'sandalwood', 'vetiver']
        if (!keywords.some(k => notes.includes(k) || desc.includes(k))) return false
      }
      if (type === 'floral') {
        const keywords = ['floral', 'rose', 'jasmine', 'flower', 'blossom', 'lavender']
        if (!keywords.some(k => notes.includes(k) || desc.includes(k))) return false
      }
      if (type === 'fresh') {
        const keywords = ['fresh', 'citrus', 'lemon', 'bergamot', 'mint', 'aquatic', 'sea']
        if (!keywords.some(k => notes.includes(k) || desc.includes(k))) return false
      }
      if (type === 'spicy') {
        const keywords = ['spice', 'spicy', 'amber', 'cardamom', 'cinnamon', 'saffron', 'pepper']
        if (!keywords.some(k => notes.includes(k) || desc.includes(k))) return false
      }
    }

    return true
  })

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif font-bold text-center mb-4 gold-text-gradient"
        >
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Perfumes` : 'All Perfumes'}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search perfumes..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white/80 backdrop-blur-md text-gray-800"
              />
            </div>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white/80 backdrop-blur-md text-gray-800"
            >
              <option value="">All Categories</option>
              <option value="arabic">Arabic</option>
              <option value="french">French</option>
              <option value="attars">Attars</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>

            <select
              value={filters.fragranceType}
              onChange={(e) => setFilters({ ...filters, fragranceType: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white/80 backdrop-blur-md text-gray-800"
            >
              <option value="">All Fragrance Types</option>
              <option value="woody">Woody / Oud</option>
              <option value="floral">Floral / Sweet</option>
              <option value="fresh">Fresh / Citrus</option>
              <option value="spicy">Spicy / Warm Amber</option>
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white/80 backdrop-blur-md text-gray-800"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white/80 backdrop-blur-md text-gray-800"
            />

            <label className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gold-200 bg-white/80 backdrop-blur-md text-gray-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.featuredOnly}
                onChange={(e) => setFilters({ ...filters, featuredOnly: e.target.checked })}
                className="rounded text-gold-600 focus:ring-gold-500 h-4 w-4"
              />
              <span className="text-sm font-medium">Featured Only</span>
            </label>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card h-[420px] bg-white/20 border border-gold-200/20 rounded-2xl"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
