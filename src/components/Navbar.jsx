import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSearch, FiChevronDown, FiLogOut, FiList, FiTrendingUp } from 'react-icons/fi'
import { FaInstagram } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isOpen, setIsOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const userDropdownRef = useRef(null)
  const categoryDropdownRef = useRef(null)

  // Parse search from URL on load/navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchQuery(params.get('search') || '')
  }, [location.search])

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false)
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/shop')
    }
  }

  const categories = [
    { name: 'Arabic Perfumes', path: 'arabic' },
    { name: 'French Perfumes', path: 'french' },
    { name: 'Luxury Attars', path: 'attars' },
    { name: 'For Men', path: 'men' },
    { name: 'For Women', path: 'women' },
    { name: 'Unisex', path: 'unisex' },
  ]

  return (
    <nav className="bg-gray-950/95 backdrop-blur-xl border-b border-gold-500/20 sticky top-0 z-50 shadow-lg shadow-black/30 transition duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-24 py-3 sm:py-0 gap-2 sm:gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-xl sm:text-3xl font-serif font-bold tracking-wide gold-text-gradient hover:scale-[1.02] transition duration-300 whitespace-nowrap">
              Oud Mistique
            </span>
          </Link>

          {/* Center Links with Category Dropdown */}
          <div className="hidden lg:flex items-center space-x-10 font-sans text-sm font-medium">
            <NavLink to="/" className={({ isActive }) => `text-gray-300 hover:text-gold-400 transition transform hover:scale-[1.02] duration-300 ${isActive ? 'text-gold-400 font-semibold' : ''}`}>
              Home
            </NavLink>

            {/* Categories Dropdown Trigger */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center gap-1 text-gray-300 hover:text-gold-400 transition cursor-pointer"
              >
                Collection
                <FiChevronDown size={14} className={`transform transition duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute left-0 mt-3 w-56 bg-gray-900/95 backdrop-blur-xl border border-gold-500/30 rounded-2xl shadow-xl p-2 z-50"
                  >
                    <div className="text-[10px] font-bold text-gold-400 tracking-widest uppercase px-3 py-2 border-b border-gold-500/20 mb-1">
                      Choose category
                    </div>
                    {categories.map(cat => (
                      <NavLink
                        key={cat.path}
                        to={`/shop/${cat.path}`}
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-xl text-xs text-gray-300 hover:bg-gold-950/50 hover:text-gold-400 transition ${
                            isActive ? 'bg-gold-950/50 text-gold-400 font-bold' : ''
                          }`
                        }
                      >
                        {cat.name}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/shop" end className={({ isActive }) => `text-gray-300 hover:text-gold-400 transition transform hover:scale-[1.02] duration-300 ${isActive ? 'text-gold-400 font-semibold' : ''}`}>
              Shop All
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `text-gray-300 hover:text-gold-400 transition transform hover:scale-[1.02] duration-300 ${isActive ? 'text-gold-400 font-semibold' : ''}`}>
              Contact
            </NavLink>
          </div>

          {/* Enhanced Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative max-w-md flex-grow mx-6">
            <input
              type="text"
              placeholder="Search luxury scents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-gold-500/30 text-white placeholder-gray-400 rounded-full px-6 py-2.5 pl-12 text-xs focus:outline-none focus:ring-2 focus:ring-gold-400 focus:bg-white/10 transition duration-300 font-sans"
            />
            <FiSearch size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-400" />
          </form>

          {/* Right Icon Actions */}
          <div className="flex items-center space-x-2 sm:space-x-5 text-gray-300 flex-shrink-0">
            
            {/* Instagram Icon */}
            <a
              href="https://instagram.com/oudh_mistique"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex text-gray-300 hover:text-gold-400 hover:scale-110 transition duration-300 p-1 cursor-pointer items-center"
              aria-label="Instagram"
            >
              <FaInstagram size={19} />
            </a>

            {/* User Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              {user ? (
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 text-gray-300 hover:text-gold-400 transition cursor-pointer p-1 rounded-full hover:bg-white/5"
                >
                  <FiUser size={21} />
                  <span className="text-xs font-sans font-semibold hidden md:inline max-w-[80px] truncate text-gray-300 hover:text-gold-400">
                    {user.first_name || 'Account'}
                  </span>
                  <FiChevronDown size={12} className="hidden md:inline text-gray-400" />
                </button>
              ) : (
                <Link to="/login" className="text-gray-300 hover:text-gold-400 hover:scale-110 transition duration-300 p-1 cursor-pointer">
                  <FiUser size={21} />
                </Link>
              )}

              {/* User Dropdown Panel */}
              <AnimatePresence>
                {isUserDropdownOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-3 w-56 bg-gray-900/95 backdrop-blur-xl border border-gold-500/30 rounded-2xl shadow-xl p-2 z-50 font-sans text-white"
                  >
                    <div className="px-3 py-2 border-b border-gold-500/20 mb-1">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Logged In As</p>
                      <p className="text-xs font-bold text-gold-400 truncate">{user.first_name} {user.last_name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-300 hover:bg-gold-950/50 hover:text-gold-400 transition"
                    >
                      <FiList size={13} />
                      Order History
                    </Link>

                    {user.is_staff && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-300 hover:bg-gold-950/50 hover:text-gold-400 transition"
                      >
                        <FiTrendingUp size={13} />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout()
                        setIsUserDropdownOpen(false)
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition cursor-pointer"
                    >
                      <FiLogOut size={13} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Enlarged Cart Icon */}
            <Link to="/cart" className="relative text-gray-300 hover:text-gold-400 hover:scale-110 transition duration-300 p-1 flex items-center">
              <FiShoppingCart size={22} />
              {cart.items?.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 gold-gradient text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-md shadow-gold-500/20 animate-bounce">
                  {cart.items.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-gray-300 hover:text-gold-400 transition p-1 cursor-pointer"
            >
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-950/98 backdrop-blur-xl border-t border-gold-500/20 text-white"
          >
            <div className="px-4 py-6 space-y-4 font-sans">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search scents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-gold-500/30 text-white placeholder-gray-400 rounded-full px-5 py-2.5 pl-10 text-xs focus:outline-none focus:ring-2 focus:ring-gold-400 focus:bg-white/10 transition duration-300"
                />
                <FiSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-600" />
              </form>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <NavLink to="/" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-gray-300 hover:text-gold-400 py-1">
                  Home
                </NavLink>
                <NavLink to="/shop" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-gray-300 hover:text-gold-400 py-1">
                  Shop All
                </NavLink>
                <NavLink to="/contact" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-gray-300 hover:text-gold-400 py-1">
                  Contact Us
                </NavLink>
                {user && (
                  <NavLink to="/orders" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-gray-300 hover:text-gold-400 py-1">
                    My Orders
                  </NavLink>
                )}
              </div>

              <div className="border-t border-gold-500/20 pt-4">
                <p className="text-[10px] text-gold-400 uppercase font-bold tracking-widest mb-2">Our Collections</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {categories.map(cat => (
                    <NavLink
                      key={cat.path}
                      to={`/shop/${cat.path}`}
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gold-400 py-1"
                    >
                      {cat.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
export default Navbar
