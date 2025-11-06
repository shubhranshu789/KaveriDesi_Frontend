'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  image: string;
  rating: number;
  category: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Neelam Raghav",
    image: "/testimonial1.jpg",
    rating: 5,
    category: "A2 Cow Ghee",
    text: "Nani's Bilona Ghee has earned a permanent spot in my pantry. Its purity and flavor are unmatched by any other brand I've tried. I love supporting a company that values tradition and quality."
  },
  {
    id: 2,
    name: "Vishwajeet",
    image: "/testimonial2.jpg",
    rating: 5,
    category: "A2 Cow Ghee",
    text: "I've been incorporating more Ayurvedic practices into my lifestyle, and Nani's Bilona Ghee fits perfectly into that philosophy. It's not just ghee; it's a holistic experience."
  },
  {
    id: 3,
    name: "Ranju jha",
    image: "/testimonial3.jpg",
    rating: 5,
    category: "A2 Cow Ghee",
    text: "I've tried various brands claiming to offer authentic A2 cow ghee, but none match the richness and texture of Nani's Bilona Ghee. It's evident that they prioritize traditional methods and high-quality ingredients. My morning chai wouldn't be the same without it!"
  },
  {
    id: 4,
    name: "Sourav",
    image: "/testimonial4.jpg",
    rating: 5,
    category: "Indian Buffalo Ghee",
    text: "Nani's Bilona Ghee has earned a permanent spot in my pantry. Its purity and flavor are unmatched by any other brand I've tried. I love supporting a company that values tradition and quality, and it's evident in every spoonful of this delicious ghee."
  },
  {
    id: 5,
    name: "Naveen Sihag",
    image: "/testimonial5.jpg",
    rating: 5,
    category: "A2 Cow Ghee",
    text: "Nani's Bilona Ghee has become a kitchen essential for me. Whether I'm sauteing vegetables or drizzling it over warm rotis, its rich flavor enhances every dish."
  }
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = testimonials.length - 1;
      if (newIndex >= testimonials.length) newIndex = 0;
      return newIndex;
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <motion.span
        key={i}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: i * 0.1, type: "spring", stiffness: 500 }}
        className="text-yellow-400 text-xl drop-shadow-sm"
      >
        ★
      </motion.span>
    ));
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = -1; i <= 1; i++) {
      let index = currentIndex + i;
      if (index < 0) index = testimonials.length + index;
      if (index >= testimonials.length) index = index - testimonials.length;
      cards.push({
        testimonial: testimonials[index],
        position: i,
        index: index
      });
    }
    return cards;
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.7,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: (position: number) => ({
      x: position * 400,
      opacity: position === 0 ? 1 : 0.35,
      scale: position === 0 ? 1.05 : 0.75,
      rotateY: 0,
      zIndex: position === 0 ? 10 : 1,
    }),
    exit: (direction: number) => ({
      x: direction < 0 ? 400 : -400,
      opacity: 0,
      scale: 0.7,
      rotateY: direction < 0 ? 45 : -45,
    })
  };

  return (
    <div className="w-full py-16 px-4 bg-gradient-to-b from-[#b5c4a1] to-[#a8b896]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-[#5a6b4d] mb-4 drop-shadow-sm"
          >
            Reviews from our customers
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 bg-white/30 backdrop-blur-sm rounded-full px-6 py-2 w-fit mx-auto"
          >
            <span className="text-[#5a6b4d] text-xl font-bold">4.9 / 5.0</span>
            <div className="flex">{renderStars(5)}</div>
          </motion.div>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div className="flex items-center justify-center min-h-[500px] px-4 md:px-24">
            <AnimatePresence initial={false} custom={direction}>
              {getVisibleCards().map(({ testimonial, position, index }) => {
                const isCenter = position === 0;
                
                return (
                  <motion.div
                    key={`${index}-${currentIndex}`}
                    custom={position}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 350, damping: 35 },
                      opacity: { duration: 0.4 },
                      scale: { duration: 0.4 },
                      rotateY: { duration: 0.4 }
                    }}
                    style={{ perspective: 1000 }}
                    className={`absolute bg-gradient-to-br from-white to-gray-50 rounded-[2rem] p-10 w-full md:w-[450px] ${
                      isCenter 
                        ? 'shadow-[0_20px_60px_rgba(0,0,0,0.3)] ring-2 ring-white/50' 
                        : 'pointer-events-none shadow-lg'
                    }`}
                  >
                    {/* Decorative Quote Icon */}
                    <motion.div
                      initial={{ rotate: 0, scale: 1 }}
                      animate={{ 
                        rotate: isCenter ? [0, 5, -5, 0] : 0,
                        scale: isCenter ? 1 : 0.8
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="absolute -top-4 -right-4 bg-gradient-to-br from-[#5a6b4d] to-[#7a8b6d] p-4 rounded-full shadow-lg"
                    >
                      <Quote className="w-8 h-8 text-white" />
                    </motion.div>

                    <div className="mb-6">
                      <motion.p 
                        className="text-xs font-semibold text-[#5a6b4d] uppercase tracking-widest mb-3 bg-[#b5c4a1]/20 px-4 py-1.5 rounded-full w-fit"
                        animate={isCenter ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                      >
                        {testimonial.category}
                      </motion.p>
                      <p className="text-gray-700 text-lg leading-relaxed min-h-[180px] font-medium">
                        "{testimonial.text}"
                      </p>
                    </div>

                    <div className="flex items-center gap-5 pt-6 border-t-2 border-gray-200/50">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative"
                      >
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md"
                        />
                        <motion.div
                          className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                        <div className="flex mt-1">{renderStars(testimonial.rating)}</div>
                      </div>
                    </div>

                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-[2rem] pointer-events-none" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons - Enhanced */}
          <motion.button
            whileHover={{ scale: 1.15, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 bg-gradient-to-br from-white to-gray-100 hover:from-white hover:to-white p-4 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-200 z-20 ring-2 ring-white/50"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-7 h-7 text-[#5a6b4d]" strokeWidth={2.5} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.15, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 bg-gradient-to-br from-white to-gray-100 hover:from-white hover:to-white p-4 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-200 z-20 ring-2 ring-white/50"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-7 h-7 text-[#5a6b4d]" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Enhanced Dots Indicator */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-12 h-3 bg-gradient-to-r from-[#5a6b4d] to-[#7a8b6d] shadow-lg'
                  : 'w-3 h-3 bg-white/60 hover:bg-white shadow-md'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
