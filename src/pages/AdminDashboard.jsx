import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'
import api from '../services/api'
import toast from 'react-hot-toast'

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    image: null, // File object
    fragrance_notes: '',
    gender: 'male', // default
    attar_price_6ml: 0,
    attar_price_12ml: 0,
    perfume_price_20ml: 0,
    perfume_price_30ml: 0,
    perfume_price_50ml: 0,
    wear_to_use: 'daily', // default
    stock: 0,
    featured: false,
    category: '', // required
  })
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products/'),
        api.get('/orders/')
      ])
      setProducts(productsRes.data.results || productsRes.data)
      setOrders(ordersRes.data.results || ordersRes.data)
    } catch (error) {
      toast.error('Failed to fetch data')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewProduct(prev => ({ ...prev, image: file }))
      // Preview the image
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setNewProduct(prev => ({ ...prev, image: null }))
      setImagePreview('')
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', newProduct.name)
      formData.append('description', newProduct.description)
      if (newProduct.image) {
        formData.append('image', newProduct.image)
      }
      formData.append('fragrance_notes', newProduct.fragrance_notes)
      formData.append('gender', newProduct.gender)
      formData.append('attar_price_6ml', newProduct.attar_price_6ml)
      formData.append('attar_price_12ml', newProduct.attar_price_12ml)
      formData.append('perfume_price_20ml', newProduct.perfume_price_20ml)
      formData.append('perfume_price_30ml', newProduct.perfume_price_30ml)
      formData.append('perfume_price_50ml', newProduct.perfume_price_50ml)
      formData.append('wear_to_use', newProduct.wear_to_use)
      formData.append('stock', newProduct.stock)
      formData.append('featured', newProduct.featured)
      formData.append('category', newProduct.category)

      await api.post('/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Product added successfully')
      setNewProduct({
        name: '',
        description: '',
        image: null,
        fragrance_notes: '',
        gender: 'male',
        attar_price_6ml: 0,
        attar_price_12ml: 0,
        perfume_price_20ml: 0,
        perfume_price_30ml: 0,
        perfume_price_50ml: 0,
        wear_to_use: 'daily',
        stock: 0,
        featured: false,
        category: '',
      })
      setImagePreview('')
      fetchData()
    } catch (error) {
      toast.error('Failed to add product')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif font-bold mb-12 gold-text-gradient"
        >
          Admin Dashboard
        </motion.h1>

        <div className="flex space-x-4 mb-8 overflow-x-auto">
          {['dashboard', 'products', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium capitalize transition ${
                activeTab === tab ? 'gold-gradient text-white' : 'bg-white/50 text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 text-center">
              <FiPackage size={32} className="mx-auto text-gold-600 mb-2" />
              <h3 className="text-2xl font-bold">{products.length}</h3>
              <p className="text-gray-600">Products</p>
            </div>
            <div className="glass-card p-6 text-center">
              <FiShoppingBag size={32} className="mx-auto text-gold-600 mb-2" />
              <h3 className="text-2xl font-bold">{orders.length}</h3>
              <p className="text-gray-600">Orders</p>
            </div>
            <div className="glass-card p-6 text-center">
              <FiUsers size={32} className="mx-auto text-gold-600 mb-2" />
              <h3 className="text-2xl font-bold">120</h3>
              <p className="text-gray-600">Customers</p>
            </div>
            <div className="glass-card p-6 text-center">
              <FiDollarSign size={32} className="mx-auto text-gold-600 mb-2" />
              <h3 className="text-2xl font-bold">₹{orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0)}</h3>
              <p className="text-gray-600">Revenue</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-card p-6 mb-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                    className="px-4 py-2 rounded-lg border border-gold-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-gold-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="px-4 py-2 rounded-lg border border-gold-200"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="max-w-xs h-auto rounded" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Fragrance Notes (optional)"
                    value={newProduct.fragrance_notes}
                    onChange={(e) => setNewProduct({ ...newProduct, fragrance_notes: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-gold-200"
                  />
                </div>
                <div>
                  <select
                    value={newProduct.gender}
                    onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-gold-200"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Attar Price 6ml"
                      value={newProduct.attar_price_6ml}
                      onChange={(e) => setNewProduct({ ...newProduct, attar_price_6ml: parseFloat(e.target.value) || 0 })}
                      className="px-4 py-2 rounded-lg border border-gold-200"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Attar Price 12ml"
                      value={newProduct.attar_price_12ml}
                      onChange={(e) => setNewProduct({ ...newProduct, attar_price_12ml: parseFloat(e.target.value) || 0 })}
                      className="px-4 py-2 rounded-lg border border-gold-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Perfume Price 20ml"
                      value={newProduct.perfume_price_20ml}
                      onChange={(e) => setNewProduct({ ...newProduct, perfume_price_20ml: parseFloat(e.target.value) || 0 })}
                      className="px-4 py-2 rounded-lg border border-gold-200"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Perfume Price 30ml"
                      value={newProduct.perfume_price_30ml}
                      onChange={(e) => setNewProduct({ ...newProduct, perfume_price_30ml: parseFloat(e.target.value) || 0 })}
                      className="px-4 py-2 rounded-lg border border-gold-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Perfume Price 50ml"
                      value={newProduct.perfume_price_50ml}
                      onChange={(e) => setNewProduct({ ...newProduct, perfume_price_50ml: parseFloat(e.target.value) || 0 })}
                      className="px-4 py-2 rounded-lg border border-gold-200"
                    />
                  </div>
                  <div>
                    <select
                      value={newProduct.wear_to_use}
                      onChange={(e) => setNewProduct({ ...newProduct, wear_to_use: e.target.value })}
                      className="px-4 py-2 rounded-lg border border-gold-200"
                    >
                      <option value="daily">Daily</option>
                      <option value="evening">Evening</option>
                      <option value="special">Special Occasion</option>
                      <option value="sport">Sport</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                      className="px-4 py-2 rounded-lg border border-gold-200"
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newProduct.featured}
                        onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                        className="mr-2 h-4 w-4 text-gold-600"
                      />
                      Featured
                    </label>
                  </div>
                </div>
                <div>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                    className="px-4 py-2 rounded-lg border border-gold-200"
                  >
                    <option value="">Select Category</option>
                    <option value="arabic">Arabic</option>
                    <option value="french">French</option>
                    <option value="attars">Attars</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="gold-gradient text-white py-2 rounded-lg">
                    Add Product
                  </button>
                </div>
              </form>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-2xl font-serif font-bold mb-6">Products List</h2>
              <div className="space-y-4">
                {products.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-white/30 rounded-lg">
                    <span className="font-medium">{product.name}</span>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gold-600 hover:text-gold-800">
                        <FiEdit />
                      </button>
                      <button className="p-2 text-red-500 hover:text-red-700">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
            <h2 className="text-2xl font-serif font-bold mb-6">Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold-200">
                    <th className="text-left py-3">Order ID</th>
                    <th className="text-left py-3">Customer</th>
                    <th className="text-left py-3">Total</th>
                    <th className="text-left py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-gold-100">
                      <td className="py-3">#{order.id}</td>
                      <td className="py-3">{order.full_name}</td>
                      <td className="py-3 gold-text-gradient font-medium">₹{order.total}</td>
                      <td className="py-3 capitalize">{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}