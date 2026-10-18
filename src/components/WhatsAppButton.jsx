import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

export const WhatsAppButton = () => {
  const url = "https://wa.me/917204771584?text=Hello,%20I%20am%20interested%20in%20your%20perfumes."

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer hover:shadow-[0_0_20px_rgba(37,211,102,0.6)]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-pulse-ring pointer-events-none" />
      <FaWhatsapp size={28} className="relative z-10" />
    </motion.a>
  )
}
export default WhatsAppButton
