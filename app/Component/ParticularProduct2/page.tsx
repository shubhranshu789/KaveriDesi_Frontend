'use client'
import React, { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Zap, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Navbar from '@/components/navbar';

import ReviewSection from "../../Component/Testimonials/ReviewSection/page"


// import "../../Component/CheckOut/page"



interface MemoryBook {
  id: string;
  title: string;
  price: string;
  description: string;
  image: string;
}


// Separate the component that uses useSearchParams
function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = searchParams.get('title');
  const price = searchParams.get('price');
  const description = searchParams.get('description');
  const image12 = searchParams.get('image');
  const pid = searchParams.get('id');






  const basePrice = Number(searchParams.get('price')) || 1099;

  const [selectedPages, setSelectedPages] = useState<50 | 100 | 200>(50);

  // Calculate final price based on page selection
  const getPriceByPages = () => {
    switch (selectedPages) {
      case 50:
        return basePrice;
      case 100:
        return basePrice + 200;
      case 200:
        return basePrice + 300;
      default:
        return basePrice;
    }
  };

  const finalPrice = getPriceByPages();

  const getQuantityLabel = (pages: any) => {
    switch (pages) {
      case 50:
        return '500 ml';
      case 100:
        return '1 Liter';
      case 200:
        return '2 Liter';
      default:
        return '500 ml';
    }
  };


  const product: MemoryBook = {
    id: pid || '',
    title: title || '',
    price: price || '',
    description: description || '',
    image: image12 || ''
  };


  const handleBuyNow = () => {
    // Use the product object created from URL params
    const params = new URLSearchParams({
      buyNow: 'true',
      id: product.id,
      image: product.image,
      title: `${product.title} - ${getQuantityLabel(selectedPages)}`,  // Updated with quantity
      price: finalPrice.toString(),
      description: product.description,
      quantity: '1'
    });

    router.push(`/Component/CheckOut?${params.toString()}`);
  };






  // Multiple product images - main image from URL params plus additional views
  const productImages = [
    searchParams.get('image') || '/placeholder.jpg',
    searchParams.get('image2') || '/placeholder.jpg',
  ];

  // const handleBuyNow = () => {
  //   console.log('Buy Now clicked');
  // };



  const handleAddToCart = async () => {
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
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('Added to cart successfully');
        alert('Item added to cart!');
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

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToWishlist = async () => {
    setLoading(true);

    try {
      const userString = localStorage.getItem('user');

      if (!userString) {
        alert('Please login to add items to wishlist');
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id;

      console.log('Adding to wishlist with userId:', userId);

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
      console.log('Response data:', data);

      if (data.success) {
        console.log('Added to wishlist successfully');
        alert('Item added to wishlist!');
        setIsInWishlist(true);
        setIsWishlisted(true);
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

      console.log('Removing from wishlist with userId:', userId);

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
      console.log('Response data:', data);

      if (data.success) {
        console.log('Removed from wishlist successfully');
        alert('Item removed from wishlist!');
        setIsInWishlist(false);
        setIsWishlisted(false);
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

            {/* Main Image Display */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4 group">
              <img
                src={productImages[selectedImageIndex]}
                alt={`${title} - View ${selectedImageIndex + 1}`}
                className={`w-full h-full object-cover transition-transform duration-500 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Zoom Indicator */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
                Click to zoom
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {productImages.length}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImageIndex === index
                    ? 'border-indigo-600 ring-2 ring-indigo-200'
                    : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedImageIndex === index && (
                    <div className="absolute inset-0 bg-indigo-600/10"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Thumbnail Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${selectedImageIndex === index
                    ? 'w-8 bg-indigo-600'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`View image ${index + 1}`}
                />
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
                {/* <span className="text-4xl font-bold text-gray-900">
                  ₹{price}
                </span> */}

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
                      <span className="font-medium">500 ml</span>
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
                      <span className="font-medium">1 Liter</span>
                      <span className="ml-2 text-gray-600">- ₹{basePrice + 200}</span>
                      <span className="ml-2 text-sm text-green-600">(+₹200)</span>
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
                      <span className="font-medium">2 Liter</span>
                      <span className="ml-2 text-gray-600">- ₹{basePrice + 300}</span>
                      <span className="ml-2 text-sm text-green-600">(+₹300)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Quantity Selector */}
              {/* <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 border-x border-gray-300 font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div> */}

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Buy Now - Primary CTA */}
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
                >
                  <Zap className="w-5 h-5" />
                  Buy Now
                </button>

                <div className="grid grid-cols-2 gap-3">
                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-xl border-2 border-gray-300 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {loading ? 'Adding...' : 'Add to Cart'}
                  </button>

                  {/* Wishlist Toggle */}
                  <button
                    onClick={handleToggleWishlist}
                    disabled={loading}
                    className={`font-semibold py-4 px-6 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isWishlisted
                      ? 'bg-pink-50 border-pink-500 text-pink-600'
                      : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-pink-600' : ''}`} />
                    {loading ? '...' : isWishlisted ? 'Wishlisted' : 'Wishlist'}
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

// Main Page component with Suspense wrapper
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
