'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useSpring } from 'framer-motion';
import Testimonial from "../app/Component/Testimonials/page"
import Navbar from "@/components/navbar"
import { useEffect, useState } from 'react'

export default function DairyPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Progress bar for scroll depth
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const products = [
    {
      id: 'milk',
      name: 'Fresh Milk',
      badge: 'Farm to Table',
      description: 'Pure and creamy farm-fresh milk, packed with essential nutrients and calcium for your daily health.',
      image: '/Products/milk.jpg',
      image2: '/Products/milk.jpg',
      videoUrl: '/Vdos/milk.mp4',
      price: '499 Rs'
    },
    {
      id: 'ghee',
      name: 'Pure Desi Ghee',
      badge: 'Traditional Method',
      description: 'Handcrafted premium ghee clarified to perfection, delivering rich aroma and health benefits in every spoon.',
      image: '/Products/ghee.jpg',
      image2: '/Products/ghee.jpg',
      videoUrl: '/Vdos/ghee.mp4',
      price: '199 Rs'
    },
    {
      id: 'jag',
      name: 'Organic Jaggery',
      badge: 'Natural Sweetener',
      description: 'Smooth and delicious unrefined sugar, perfect for a healthy lifestyle. Rich in iron and minerals.',
      image: '/Products/jagry.jpg',
      image2: '/Products/jagry.jpg',
      videoUrl: '/Vdos/jagrery.mp4',
      price: '699 Rs'
    }
  ];

  const handleNavigation = (product: any) => {
    const query = new URLSearchParams({
      id: product.id,
      image: product.image,
      image2: product.image2,
      title: product.name,
      price: product.price,
      description: product.description,
      videoUrl: product.videoUrl
    }).toString();

    const path = product.id.startsWith('jag') ? 'ParticularProductKg' : 'ParticularProduct2';
    router.push(`/Component/${path}?${query}`);
  };

  return (
    <div>
      <Navbar />
      <div className="relative">
        
        {/* Scroll Progress Bar */}
        <motion.div className="fixed top-0 left-0 right-0 h-1 bg-amber-400 origin-left z-50" style={{ scaleX }} />

        <main className="min-h-screen bg-[#fafaf9]">
          
          {/* --- HERO SECTION --- */}
          <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0 ">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source src="/Vdos/hero.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="container relative z-10 text-center px-4"
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-200 text-sm font-medium mb-6 inline-block backdrop-blur-md"
              >
                ✨ Pure. Organic. Local.
              </motion.span>
              <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 tracking-tight">
                Kaveri <span className="text-amber-300">Desi</span>
              </h1>
              <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                Bringing the authentic taste of the countryside directly to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-full px-10 py-7 text-lg transition-transform hover:scale-105"
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                  Shop Fresh Now
                </Button>
              </div>
            </motion.div>

            {/* Floating Stats Card (Live Feel) */}
            <div className="absolute bottom-12 left-0 right-0 hidden md:block">
              <div className="container mx-auto flex justify-center gap-12 text-white">
                <div className="text-center">
                  <p className="text-3xl font-bold">10k+</p>
                  <p className="text-xs uppercase tracking-widest opacity-70">Deliveries</p>
                </div>
                <div className="h-10 w-[1px] bg-white/20" />
                <div className="text-center">
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-xs uppercase tracking-widest opacity-70">Organic</p>
                </div>
                <div className="h-10 w-[1px] bg-white/20" />
                <div className="text-center">
                  <p className="text-3xl font-bold">24h</p>
                  <p className="text-xs uppercase tracking-widest opacity-70">Freshness</p>
                </div>
              </div>
            </div>
          </section>

          {/* --- PRODUCTS SECTION --- */}
          <section className="py-24 px-4 bg-white">
            <div className="container mx-auto max-w-6xl">
              <div className="mb-20 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Premium Collection</h2>
                <div className="h-1.5 w-20 bg-amber-400 mx-auto rounded-full" />
              </div>

              <div className="grid gap-20">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden rounded-[2rem]">
                      <CardContent className="p-0">
                        <div className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-stretch`}>
                          {/* Video Side */}
                          <div className="w-full md:w-1/2 relative h-[350px] md:h-auto overflow-hidden">
                            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                              <source src={product.videoUrl} type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>

                          {/* Text Side */}
                          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white">
                            <span className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-3">{product.badge}</span>
                            <h3 className="text-3xl md:text-5xl font-bold mb-6 text-slate-800">{product.name}</h3>
                            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-slate-400 text-sm">Starting from</p>
                                <p className="text-3xl font-black text-slate-900">{product.price}</p>
                              </div>
                              <Button 
                                onClick={() => handleNavigation(product)}
                                className="bg-slate-900 text-white hover:bg-amber-500 hover:text-black rounded-full px-8 py-6 transition-all"
                              >
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* --- TESTIMONIALS --- */}
          <div className="bg-slate-50 py-20">
            <Testimonial />
          </div>

        </main>
      </div>
    </div>
  )
}