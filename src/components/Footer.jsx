import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiCompass, FiSend, FiClock, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { motion } from 'framer-motion'

export const Footer = () => {
  const whatsappUrl = "https://wa.me/917204771584?text=Hello,%20I%20am%20interested%20in%20your%20perfumes."

  return (
    <footer className="bg-gradient-to-br from-white/90 to-gold-50/40 backdrop-blur-xl border-t border-gold-200/40 mt-20 relative z-10 shadow-[0_-5px_20px_rgba(212,175,55,0.03)] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div>
            <h3 className="text-3xl font-serif font-bold gold-text-gradient mb-5 tracking-wide">Oud Mistique</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 font-light">
              Premium luxury perfumes crafted with the world's finest ingredients for the discerning fragrance connoisseur. Experience olfactory royalty.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/oudh_mistique" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 rounded-full border border-gold-200/50 text-gold-700 hover:bg-gold-500 hover:text-white transition duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a href="#" className="p-2.5 rounded-full border border-gold-200/50 text-gold-700 hover:bg-gold-500 hover:text-white transition duration-300">
                <FiFacebook size={16} />
              </a>
              <a href="#" className="p-2.5 rounded-full border border-gold-200/50 text-gold-700 hover:bg-gold-500 hover:text-white transition duration-300">
                <FiTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-gray-800 text-base mb-5 uppercase tracking-wider border-b border-gold-200/30 pb-2">Quick Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-gold-600 transition flex items-center gap-1.5"><FiCompass size={13} className="text-gold-500" /> Home</Link></li>
              <li><Link to="/shop" className="text-gray-600 hover:text-gold-600 transition flex items-center gap-1.5"><FiCompass size={13} className="text-gold-500" /> Shop Collection</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-gold-600 transition flex items-center gap-1.5"><FiCompass size={13} className="text-gold-500" /> Contact Us</Link></li>
              <li><Link to="/orders" className="text-gray-600 hover:text-gold-600 transition flex items-center gap-1.5"><FiCompass size={13} className="text-gold-500" /> Track Orders</Link></li>
            </ul>
          </div>

          {/* Luxury Policy details */}
          <div>
            <h4 className="font-serif font-bold text-gray-800 text-base mb-5 uppercase tracking-wider border-b border-gold-200/30 pb-2">Our Promises</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <FiSend size={15} className="text-gold-600 flex-shrink-0" />
                <span>Complimentary Delivery (Free Shipping)</span>
              </li>
              <li className="flex items-center gap-2">
                <FiClock size={15} className="text-gold-600 flex-shrink-0" />
                <span>Delivery across India in 7–8 Days</span>
              </li>
              <li className="flex items-start gap-2">
                <FiClock size={15} className="text-gold-600 flex-shrink-0 mt-0.5" />
                <span>Due to customized concentration, orders cannot be returned</span>
              </li>
            </ul>
          </div>

          {/* Customer support details */}
          <div>
            <h4 className="font-serif font-bold text-gray-800 text-base mb-5 uppercase tracking-wider border-b border-gold-200/30 pb-2">Customer Support</h4>
            <div className="space-y-4 text-sm">
              <a href="mailto:oudmistique@gmail.com" className="flex items-center space-x-3 text-gray-600 hover:text-gold-600 transition">
                <FiMail size={16} className="text-gold-500" />
                <span>oudmistique@gmail.com</span>
              </a>
              <a href="tel:8088807528" className="flex items-center space-x-3 text-gray-600 hover:text-gold-600 transition">
                <FiPhone size={16} className="text-gold-500" />
                <span>+91 80888 07528</span>
              </a>
              <a href="tel:7204771584" className="flex items-center space-x-3 text-gray-600 hover:text-gold-600 transition">
                <FiPhone size={16} className="text-gold-500" />
                <span>+91 72047 71584</span>
              </a>
              {/* WhatsApp direct CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 border border-[#25D366] text-[#25D366] rounded-full hover:bg-[#25D366] hover:text-white transition duration-300 mt-2"
              >
                <FaWhatsapp size={14} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gold-200/40 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Oud Mistique. Handcrafted with gold accents. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
export default Footer