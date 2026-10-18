import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.password2) {
      return toast.error('Passwords do not match')
    }
    setLoading(true)
    try {
      await register({ email: formData.email, password: formData.password, first_name: formData.first_name, last_name: formData.last_name })
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (error) {
      toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-serif font-bold text-center mb-8 gold-text-gradient">Register</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-white py-3 rounded-lg font-medium hover:shadow-lg transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-600 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  )
}