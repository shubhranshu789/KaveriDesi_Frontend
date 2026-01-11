'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Zap, ChevronLeft, ChevronRight, ZoomIn, Check } from 'lucide-react';
import Navbar from '@/components/navbar';
import ReviewSection from "../../Component/Testimonials/ReviewSection/page"

interface MemoryBook {
  id: string;
  title: string;
  price: string;
  description: string;
  image: string;
}

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cart states
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // Wishlist states
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const title = searchParams.get('title');
  const price = searchParams.get('price');
  const description = searchParams.get('description');
  const image12 = searchParams.get('image');
  const pid = searchParams.get('id');

  const priceString = searchParams.get('price') || '0';
  const basePrice = Number(priceString.replace(/[^0-9]/g, '')) || 1000;
  const [selectedPages, setSelectedPages] = useState<50 | 100 | 200>(50);

  // Calculate final price based on page selection
  const getPriceByPages = () => {
    switch (selectedPages) {
      case 50: return basePrice;
      case 100: return basePrice + 300;
      case 200: return basePrice + 500;
      default: return basePrice;
    }
  };

  const finalPrice = getPriceByPages();

  const getQuantityLabel = (pages: any) => {
    switch (pages) {
      case 50: return '500 g';
      case 100: return '1 Kg';
      case 200: return '2 Kg';
      default: return '500 g';
    }
  };

  // Check if product is in cart
  useEffect(() => {
    const checkCartStatus = async () => {
      if (!pid) return;
      try {
        setCartLoading(true);
        const userString = localStorage.getItem('user');
        if (!userString) {
          setCartLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        const response = await fetch(
          `http://localhost:5000/checkcart?userId=${user._id}&productId=${pid}&quantityType=${selectedPages}`
        );
        const data = await response.json();

        if (data.success) {
          setIsInCart(data.isInCart);
        }
      } catch (error) {
        console.error('Cart check error:', error);
      } finally {
        setCartLoading(false);
      }
    };

    checkCartStatus();
  }, [pid, selectedPages]);

  // NEW: Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!pid) return;
      try {
        setWishlistLoading(true);
        const userString = localStorage.getItem('user');
        if (!userString) {
          setWishlistLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        const response = await fetch(
          `http://localhost:5000/checkwishlist?userId=${user._id}&productId=${pid}`
        );
        const data = await response.json();

        if (data.success) {
          setIsInWishlist(data.isInWishlist);
        }
      } catch (error) {
        console.error('Wishlist check error:', error);
      } finally {
        setWishlistLoading(false);
      }
    };

    checkWishlistStatus();
  }, [pid]);

  const product: MemoryBook = {
    id: pid || '',
    title: title || '',
    price: price || '',
    description: description || '',
    image: image12 || ''
  };

  const handleBuyNow = () => {
    const params = new URLSearchParams({
      buyNow: 'true',
      id: product.id,
      image: product.image,
      title: `${product.title} - ${getQuantityLabel(selectedPages)}`,
      price: finalPrice.toString(),
      description: product.description,
      quantity: '1'
    });
    router.push(`/Component/CheckOut?${params.toString()}`);
  };

  // Add to Cart with cart check
  const handleAddToCart = async () => {
    if (isInCart) {
      alert('Item already in cart!');
      return;
    }

    setLoading(true);
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        alert('Please login to add items to cart');
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addtocart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          productId: pid,
          image: image12,
          title: `${title} - ${getQuantityLabel(selectedPages)}`,
          price: finalPrice,
          quantityType: selectedPages,
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsInCart(true);
        console.log('Added to cart successfully');
      } else {
        console.error('Failed to add to cart:', data.message);
        alert('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Multiple product images
  const productMedia = [
    { type: 'image', src: searchParams.get('image') || '/placeholder.jpg' },
    { type: 'image', src: searchParams.get('image2') || '/placeholder.jpg' },
    { type: 'video', src: searchParams.get('videoUrl') },
  ];

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? productMedia.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === productMedia.length - 1 ? 0 : prev + 1
    );
  };

  // UPDATED: Add to Wishlist
  const handleAddToWishlist = async () => {
    if (isInWishlist) {
      alert('Item already in wishlist!');
      return;
    }

    setLoading(true);
    try {
      const userString = localStorage.getItem('user');

      if (!userString) {
        alert('Please login to add items to wishlist');
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addtowishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          productId: pid,
          image: image12,
          title: title,
          price: finalPrice
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('Added to wishlist successfully');
        setIsInWishlist(true);
      } else {
        console.error('Failed to add to wishlist:', data.message);
        alert(`Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Remove from Wishlist
  const handleRemoveFromWishlist = async () => {
    setLoading(true);

    try {
      const userString = localStorage.getItem('user');

      if (!userString) {
        alert('Please login');
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/removefromwishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          productId: pid
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('Removed from wishlist successfully');
        // alert('Item removed from wishlist!');
        setIsInWishlist(false);
      } else {
        console.error('Failed to remove from wishlist:', data.message);
        alert(`Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (isInWishlist) {
      await handleRemoveFromWishlist();
    } else {
      await handleAddToWishlist();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Product Image Gallery Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 sticky top-8 h-fit">

            {/* Main Display */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4 group">

              {productMedia[selectedImageIndex].type === 'image' ? (
                <img
                  src={productMedia[selectedImageIndex].src}
                  alt={`${title} - View ${selectedImageIndex + 1}`}
                  className={`w-full h-full object-cover transition-transform duration-500 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              ) : (
                <video
                  src={productMedia[selectedImageIndex].src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                  className="w-full h-full object-cover"
                  key={productMedia[selectedImageIndex].src}
                />
              )}

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {productMedia.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {productMedia.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${selectedImageIndex === index
                    ? 'border-indigo-600'
                    : 'border-gray-200'
                    }`}
                >
                  {item.type === 'image' ? (
                    <img src={item.src} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black text-white text-sm">
                      ▶ Video
                    </div>
                  )}
                </button>
              ))}
            </div>

          </div>

          {/* Product Details Section */}
          <div className="space-y-6">

            {/* Title and Price */}
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h1>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-gray-900">₹{finalPrice}</span>
                <span className="text-lg text-gray-500 line-through">
                  ₹{parseInt(finalPrice || '0') * 1.2}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  17% OFF
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                {description}
              </p>

              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3">Select Quantity:</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      name="pages"
                      value={50}
                      checked={selectedPages === 50}
                      onChange={() => setSelectedPages(50)}
                      className="w-5 h-5 accent-blue-600"
                    />
                    <div className="flex-1">
                      <span className="font-medium">500 g</span>
                      <span className="ml-2 text-gray-600">- ₹{basePrice}</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      name="pages"
                      value={100}
                      checked={selectedPages === 100}
                      onChange={() => setSelectedPages(100)}
                      className="w-5 h-5 accent-blue-600"
                    />
                    <div className="flex-1">
                      <span className="font-medium">1 Kg</span>
                      <span className="ml-2 text-gray-600">- ₹{basePrice + 300}</span>
                      <span className="ml-2 text-sm text-green-600">(+₹300)</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      name="pages"
                      value={200}
                      checked={selectedPages === 200}
                      onChange={() => setSelectedPages(200)}
                      className="w-5 h-5 accent-blue-600"
                    />
                    <div className="flex-1">
                      <span className="font-medium">2 Kg</span>
                      <span className="ml-2 text-gray-600">- ₹{basePrice + 500}</span>
                      <span className="ml-2 text-sm text-green-600">(+₹500)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons - UPDATED */}
              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
                >
                  <Zap className="w-5 h-5" />
                  Buy Now
                </button>

                <div className="grid grid-cols-2 gap-3">
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={loading || cartLoading || isInCart}
                    className={`font-semibold py-4 px-6 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isInCart
                        ? 'bg-green-50 border-green-400 text-green-800 hover:bg-green-100'
                        : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300'
                      }`}
                  >
                    {cartLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        Checking...
                      </>
                    ) : isInCart ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added to Cart
                      </>
                    ) : loading ? (
                      'Adding...'
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </button>

                  {/* UPDATED: Wishlist Toggle Button */}
                  <button
                    onClick={handleToggleWishlist}
                    disabled={loading || wishlistLoading}
                    className={`font-semibold py-4 px-6 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isInWishlist
                        ? 'bg-pink-50 border-pink-500 text-pink-600'
                        : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                  >
                    {wishlistLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                        Checking...
                      </>
                    ) : isInWishlist ? (
                      <>
                        <Heart className="w-5 h-5 fill-pink-600" />
                        Wishlisted
                      </>
                    ) : loading ? (
                      '...'
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        Wishlist
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-700">Fast and secure delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-700">7-day return policy</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-700">Cash on delivery available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ReviewSection />
    </div>
  )
}

function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading product details...</p>
        </div>
      </div>
    }>
      <ProductContent />
    </Suspense>
  )
}

export default Page
