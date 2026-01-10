'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'


import { motion } from 'framer-motion';

import Testimonial from "../app/Component/Testimonials/page"
import Footer from "../app/Component/Footer/page"
import Navbar from "@/components/navbar"
import { useEffect, useState } from 'react'

// import "../public/Vdos/ghee.mp4"

export default function DairyPage() {

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);




  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const router = useRouter();
  const products = [
    {
      id: 'milk',
      name: 'Fresh Milk',
      description: 'Pure and creamy farm-fresh milk, packed with essential nutrients and calcium for your daily health. Perfect for your morning coffee or cereal.',
      image: '/Products/milk.jpg',
      image2: '/Products/milk.jpg',
      videoUrl: '/Vdos/milk.mp4',
      price: '499 Rs'
    },
    {
      id: 'ghee',
      name: 'Ghee',
      description: 'Handcrafted premium cheese aged to perfection, delivering rich flavors in every bite. Made from the finest dairy ingredients.',
      image: '/Products/ghee.jpg',
      image2: '/Products/ghee.jpg',
      videoUrl: '/Vdos/ghee.mp4',
      price: '199 Rs'
    },
    {
      id: 'jag',
      name: 'Jagrery',
      description: 'Smooth and delicious probiotic yogurt, perfect for a healthy breakfast or snack any time. Rich in beneficial cultures.',
      image: '/Products/jagry.jpg',
      image2: '/Products/jagry.jpg',
      videoUrl: '/Vdos/jagrery.mp4',
      price: '699 Rs'
    }
  ];

  const gotoParticularProduct = (product: { id: any; image: any; image2: any; name: any; price: any; description: any; }) => {
    const query = new URLSearchParams({
      id: product.id,
      image: product.image,
      image2: product.image2,
      title: product.name,
      price: product.price,
      description: product.description
    }).toString();

    router.push(`/Component/ParticularProduct2?${query}`);
  };


  const gotoParticularProductKg = (product: { id: any; image: any; image2: any; name: any; price: any; description: any; }) => {
    const query = new URLSearchParams({
      id: product.id,
      image: product.image,
      image2: product.image2,
      title: product.name,
      price: product.price,
      description: product.description
    }).toString();

    router.push(`/Component/ParticularProductKg?${query}`);
  };


  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section with Video */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden group">
          {/* Background Video with Parallax */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/Vdos/hero.mp4" type="video/mp4" />
            </video>

            {/* Animated Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0.4 }}
              whileHover={{ opacity: 0.5 }}
              transition={{ duration: 0.3 }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          </motion.div>

          {/* Hero Content */}
          <motion.div
            className="container relative z-10 text-center px-4 max-w-5xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-block mb-6 px-6 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-sm font-semibold hover:bg-white/30 transition-all cursor-pointer"
            >
              ✨ Welcome to Kaveri Desi
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                Pure Dairy Goodness
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-lg leading-relaxed"
            >
              Farm fresh quality delivered to your door. Experience authentic dairy excellence with every glass.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => router.push('/')}
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-amber-200 to-amber-100 text-red-900 hover:from-white hover:to-amber-50 font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Explore Products
                </Button>
              </motion.div>

              {/* <motion.div
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <Button
                     onClick={() => router.push('/Component/Auth/SignIn')}
                     size="lg"
                     className="text-lg px-8 py-6 rounded-full bg-white/20 backdrop-blur-md border-2 border-white text-white hover:bg-white/30 font-bold shadow-lg hover:shadow-xl transition-all"
                   >
                     Shop Now
                   </Button>
                 </motion.div> */}
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 sm:gap-8 mt-12"
            >
              {[
                { number: '100%', label: 'Pure & Fresh' },
                { number: '24/7', label: 'Delivery Ready' },
                { number: '5000+', label: 'Happy Customers' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-all"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-amber-200">{stat.number}</p>
                  <p className="text-sm sm:text-base text-white/80">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="cursor-pointer"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <svg
                className="w-8 h-8 text-amber-200 drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            className="absolute top-20 right-10 w-32 h-32 bg-amber-300/10 rounded-full blur-3xl"
            animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 left-10 w-40 h-40 bg-red-400/10 rounded-full blur-3xl"
            animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </section>

        {/* Products Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 text-slate-900">Our Premium Collection</h2>
            <p className="text-center text-slate-600 mb-20 text-lg">Discover the finest dairy products</p>

            <div className="space-y-24">
              {products.map((product, index) => (
                <Card
                  key={product.id}
                  className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
                >
                  <CardContent className="p-0">
                    <div className={`grid md:grid-cols-2 gap-0 items-center ${index % 2 === 1 ? 'md:grid-flow-dense' : ''
                      }`}>
                      {/* Video */}
                      <div className={`relative h-80 md:h-96 overflow-hidden bg-slate-100 ${index % 2 === 1 ? 'md:col-start-2' : ''
                        }`}>
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-fit"
                        >
                          <source src={product.videoUrl} type="video/mp4" />
                        </video>
                      </div>

                      {/* Product Info */}
                      <div className="p-8 md:p-12 bg-white">
                        <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                          Product {product.id}
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">{product.name}</h3>
                        <p className="text-slate-600 text-lg mb-8 leading-relaxed">{product.description}</p>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {product.price}
                          </span>
                          <Button
                            size="lg"
                            className="rounded-full px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={() => {
                              if (product.id.startsWith('jag')) {
                                gotoParticularProductKg(product);
                              } else {
                                gotoParticularProduct(product);
                              }
                            }}
                          >
                            Explore Product
                          </Button>
                        </div>
                      </div>



                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Testimonial />

        {/* Footer */}
        {/* <Footer/> */}

      </div>
    </div>

  )
}
