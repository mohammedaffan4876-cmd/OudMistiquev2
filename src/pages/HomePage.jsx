import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheckCircle, FiShield, FiHeart, FiTruck, FiStar } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import api from '../services/api'
import { ProductCard } from '../components/ProductCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

export const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const heroSlides = [
    {
      id: 1,
      tagline: 'Haus of Premium Arabic Fragrances',
      title: 'Royal Oud Blend',
      italicTitle: 'Royal Oud',
      subtext: 'Experience the deep, warm woody notes of rare Cambodian Oud, meticulously aged for an unforgettable sensory presence.',
      image: 'hero_oud_mistique.png',
      buttonText: 'Explore Collection'
    },
    {
      id: 2,
      tagline: 'Chic French & Citrus Scents',
      title: 'Imperial Jasmine',
      italicTitle: 'Imperial Jasmine',
      subtext: 'A fresh, sparkling blend of pure jasmine blossoms, white musk, and clean citrus notes that lingers all day long.',
      image: 'hero_french_scent.png',
      buttonText: 'Browse Scents'
    },
    {
      id: 3,
      tagline: 'Pure Concentrated Perfume Oils',
      title: 'Rose De Gold',
      italicTitle: 'Rose & Gold',
      subtext: 'Handcrafted pure attar oil resting on a bed of fresh damask rose petals, blended with warm amber and gold flakes.',
      image: 'hero_luxury_attar.png',
      buttonText: 'Shop Attars'
    }
  ]

  const whatsappUrl = 'https://wa.me/917204771584?text=Hello,%20I%20am%20interested%20in%20your%20perfumes.'

  const categoriesList = [
    { name: 'Arabic Perfumes', path: 'arabic', desc: 'Mystical oud & amber blends', bg: 'from-amber-500/10 to-amber-700/10' },
    { name: 'French Perfumes', path: 'french', desc: 'Chic floral & fresh scents', bg: 'from-blue-500/10 to-blue-700/10' },
    { name: 'Luxury Attars', path: 'attars', desc: 'Pure concentrated oils', bg: 'from-emerald-500/10 to-emerald-700/10' },
    { name: 'For Men', path: 'men', desc: 'Bold woody & spicy notes', bg: 'from-gray-500/10 to-gray-700/10' },
    { name: 'For Women', path: 'women', desc: 'Sensual sweet & floral aromas', bg: 'from-rose-500/10 to-rose-700/10' },
    { name: 'Unisex', path: 'unisex', desc: 'Perfect balanced fragrances', bg: 'from-gold-500/10 to-gold-700/10' },
  ]

  const reviews = [
    {
      id: 1,
      name: "Rihan Malik",
      rating: 5,
      comment: "The Royal Oud Blend is out of this world. Long-lasting, rich, and truly premium. I get compliments every single time I wear it!",
      date: "May 15, 2026"
    },
    {
      id: 2,
      name: "Ayesha Sharma",
      rating: 5,
      comment: "Imperial Jasmine Attar smells exactly like fresh jasmine flowers. The packaging is absolutely beautiful and perfect for gifting.",
      date: "May 28, 2026"
    },
    {
      id: 3,
      name: "Kabir Dev",
      rating: 5,
      comment: "I tried Bleu de Mistique and it immediately became my daily signature scent. The freshness lasts all day long. Excellent quality!",
      date: "June 02, 2026"
    }
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/')
        setProducts(response.data.results || response.data)
      } catch (err) {
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Filter collections
  const featuredProducts = products.filter(p => p.featured).slice(0, 4)
  const bestSellers = products.slice(0, 4) // simple slice for demonstration
  const arabicCollection = products.filter(p => p.category?.name?.toLowerCase() === 'arabic').slice(0, 4)
  const frenchCollection = products.filter(p => p.category?.name?.toLowerCase() === 'french').slice(0, 4)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans bg-cream-50/20 relative z-10">
      
      {/* 1. HERO BANNER */}
      <section className="relative min-h-[90vh] lg:h-[95vh] flex items-center justify-center overflow-hidden bg-gradient-to-tr from-[#080502] via-[#160e05] to-[#080502] pt-24 lg:pt-0">
        {/* Decorative gold mesh/glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold-600/10 rounded-full filter blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full filter blur-[120px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-900/10 via-transparent to-transparent pointer-events-none opacity-60 z-0" />

        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
          effect={'fade'}
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          className="w-full h-full hero-swiper z-10"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  
                  {/* Left Column: Text Content */}
                  <div className="text-center lg:text-left space-y-6 max-w-2xl mx-auto lg:mx-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-950/50 border border-gold-500/30 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-ping" />
                      <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold-400 font-sans">
                        {slide.tagline}
                      </span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.15]">
                      The Essence of <br />
                      <span className="gold-text-gradient font-serif italic">{slide.italicTitle}</span>
                    </h1>
                    
                    <p className="text-sm sm:text-lg text-cream-100/80 font-sans font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
                      {slide.subtext}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                      <Link
                        to="/shop"
                        className="inline-flex items-center justify-center gold-gradient text-white px-8 py-4 rounded-full font-medium hover:shadow-xl hover:gold-glow transition transform hover:scale-[1.02] duration-300 w-full sm:w-auto shadow-md"
                      >
                        {slide.buttonText}
                        <FiArrowRight className="ml-2" />
                      </Link>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-white/5 backdrop-blur-md border border-gold-500/40 text-gold-300 px-8 py-4 rounded-full font-medium hover:bg-white/10 hover:border-gold-400 hover:text-gold-200 hover:shadow-lg transition transform hover:scale-[1.02] duration-300 w-full sm:w-auto gap-2"
                      >
                        <FaWhatsapp size={18} className="text-[#25D366]" />
                        Consult via WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Visual Container */}
                  <div className="flex justify-center items-center relative w-full">
                    <div className="absolute w-72 h-72 sm:w-96 sm:h-96 md:w-[450px] md:h-[450px] rounded-full border border-gold-500/20 bg-gold-500/5 filter blur-3xl pointer-events-none z-0" />
                    
                    <div className="relative group p-2.5 sm:p-4 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(212,175,55,0.08)] overflow-hidden max-w-sm sm:max-w-lg lg:max-w-xl w-full transition duration-500 hover:shadow-[0_20px_60px_rgba(212,175,55,0.15)] hover:border-gold-500/30 z-10">
                      <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />
                      <img
                        src={`${import.meta.env.BASE_URL}images/${slide.image}`}
                        alt={slide.title}
                        className="w-full h-auto max-h-[400px] object-contain rounded-2xl transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        loading="eager"
                      />
                    </div>
                  </div>
                  
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. SHOP BY CATEGORIES SECTION (Animated Cards) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gold-100/30">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest block mb-2">Curated Scents</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categoriesList.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.6 }}
            >
              <Link
                to={`/shop/${cat.path}`}
                className={`glass-card p-6 overflow-hidden block text-center border border-gold-200/40 relative group hover:border-gold-400 hover:scale-[1.03] transition-all duration-300 shadow-sm`}
              >
                <div className={`w-14 h-14 rounded-full mx-auto mb-4 bg-gradient-to-br ${cat.bg} flex items-center justify-center text-gold-700 font-serif font-bold`}>
                  {cat.name.charAt(0)}
                </div>
                <h3 className="text-sm font-serif font-bold text-gray-950 mb-1 group-hover:text-gold-600 transition">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-gray-500 font-sans leading-snug">
                  {cat.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED COLLECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cream-100/30 to-white/70 border-t border-gold-100/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-4">
            <div>
              <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest block mb-2">Our Pride</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">Featured Collection</h2>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1.5 hover:translate-x-1 transition duration-300">
              View All Collection <FiArrowRight />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-10 font-sans">Featured scents are loading...</p>
          ) : (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },
                640: { slidesPerView: 2, spaceBetween: 25 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
              }}
              className="featured-swiper pb-12"
            >
              {featuredProducts.map((product) => (
                <SwiperSlide key={product.id} className="h-auto pb-4">
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* 4. BEST SELLERS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gold-100/30">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-4">
          <div>
            <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest block mb-2">High Demand</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">Best Sellers</h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1.5 hover:translate-x-1 transition duration-300">
            Discover Scents <FiArrowRight />
          </Link>
        </div>

        {bestSellers.length === 0 ? (
          <p className="text-center text-gray-500 py-10 font-sans">Scents are loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. ARABIC PERFUME COLLECTION */}
      {arabicCollection.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500/5 to-gold-500/5 border-t border-b border-gold-200/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-4">
              <div>
                <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest block mb-2">Exotic Oud & Amber</span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">Arabic Perfumes</h2>
              </div>
              <Link to="/shop/arabic" className="text-sm font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1.5 hover:translate-x-1 transition duration-300">
                Browse Arabic Perfumes <FiArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {arabicCollection.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. FRENCH PERFUME COLLECTION */}
      {frenchCollection.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-4">
            <div>
              <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest block mb-2">Chic Floral & Citrus</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">French Perfumes</h2>
            </div>
            <Link to="/shop/french" className="text-sm font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1.5 hover:translate-x-1 transition duration-300">
              Browse French Perfumes <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {frenchCollection.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 7. WHY CHOOSE US SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/60 border-t border-gold-200/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest block mb-2">The Difference</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">Why Oud Mistique?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 font-sans">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full gold-gradient text-white flex items-center justify-center mx-auto mb-4 shadow-md">
                <FiShield size={20} />
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-2">Pure Handcrafted Blends</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Hand-blended by expert perfume houses using only natural oils, Cambodian Oud, and finest ingredients.
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full gold-gradient text-white flex items-center justify-center mx-auto mb-4 shadow-md">
                <FiHeart size={20} />
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-2">Extra Long-Lasting</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Carefully optimized higher oil concentrations that stay attached to your skin and clothes all day.
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full gold-gradient text-white flex items-center justify-center mx-auto mb-4 shadow-md">
                <FiTruck size={20} />
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-2">Complimentary Delivery</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Complementary shipping across India. Safely packed in double-cushioned premium boxes.
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full gold-gradient text-white flex items-center justify-center mx-auto mb-4 shadow-md">
                <FaWhatsapp size={20} />
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-2">Scents Customization</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Connect directly on WhatsApp to tailor your bottles, custom blend notes, or request gifting packs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest block mb-2">Verified Feedbacks</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">Connoisseur Reviews</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <motion.div
              key={rev.id}
              whileHover={{ y: -5 }}
              className="glass-card p-8 border border-gold-200/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-gold-500 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <FiStar key={i} className="fill-current" size={15} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm italic font-serif leading-relaxed mb-6">
                  "{rev.comment}"
                </p>
              </div>
              <div className="flex justify-between items-center text-xs font-sans border-t border-gold-200/20 pt-4">
                <span className="font-bold text-gray-900">{rev.name}</span>
                <span className="text-gray-400">{rev.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Instagram Follow Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gold-200/20 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-500/5 rounded-full filter blur-[80px] pointer-events-none" />
        <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest block mb-2">Join The Connoisseurs</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Follow Our Journey</h2>
        <p className="text-gray-500 text-sm max-w-lg mx-auto mb-8 font-light">
          Get exclusive updates on rare batches, fragrance launch events, and a behind-the-scenes look at our luxury blending process.
        </p>
        <a
          href="https://instagram.com/oudh_mistique"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-gold-500 text-gold-700 hover:bg-gold-500 hover:text-white px-8 py-3.5 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 transform hover:scale-[1.02] cursor-pointer shadow-sm hover:shadow-lg"
        >
          <FaInstagram size={18} />
          <span>@oudh_mistique on Instagram</span>
        </a>
      </section>

      {/* 9. WHATSAPP CTA BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl border border-gold-200/30 text-center"
        >
          {/* Subtle gold design overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent pointer-events-none" />

          <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest block mb-4">Tailored Experience</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
            Design Your Custom Luxury Blend
          </h2>
          <p className="text-sm md:text-base text-gray-300 font-sans max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            Need a larger concentration, custom size, or bespoke fragrance notes? Connect directly with our fragrance experts on WhatsApp to order your customized perfumes.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 gold-gradient hover:gold-glow text-white font-medium px-8 py-4 rounded-full transition transform hover:scale-[1.02] duration-300 shadow-lg cursor-pointer"
          >
            <FaWhatsapp size={18} />
            Chat with Scent Experts
          </a>
        </motion.div>
      </section>

    </div>
  )
}
export default HomePage