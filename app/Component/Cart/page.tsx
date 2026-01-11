'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'; // npm install lucide-react
import { useRouter } from 'next/navigation'

import Navbar from "@/components/navbar"

// import "../../Component/CheckOut/page"

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [subTotal, setSubTotal] = useState('0.00');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();






  const handleCartCheckout = () => {
    router.push('/Component/CheckOut');
  };


  // Fetch cart items
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        // alert('Please login first');
        router.push('/')
        return;
      }

      const user = JSON.parse(userString);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getcart/${user._id}`);
      const data = await response.json();

      if (data.success) {
        setCartItems(data.cart);
        setTotalItems(data.totalItems);
        setSubTotal(data.subTotal);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (productId: any, newQuantity: number) => {
    setUpdating(true);
    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updatecartquantity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          productId: productId,
          quantity: newQuantity
        })
      });

      const data = await response.json();

      if (data.success) {
        setCartItems(data.cart);
        setTotalItems(data.totalItems);
        setSubTotal(data.subTotal);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleIncrement = (productId: any, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecrement = (productId: any, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      if (confirm('Remove this item from cart?')) {
        updateQuantity(productId, 0);
      }
    }
  };

  const handleRemove = async (productId: any) => {
    if (!confirm('Remove this item from your cart?')) return;

    setUpdating(true);
    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/removefromcart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, productId: productId })
      });

      const data = await response.json();

      if (data.success) {
        setCartItems(data.cart);
        setTotalItems(data.totalItems);
        setSubTotal(data.subTotal);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar/>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Loading your cart...</p>
          </div>
        </div>
      </div>

    );
  }

  return (

    <div>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <ShoppingBag className="w-10 h-10 text-blue-600" />
              Shopping Cart
            </h1>
            <p className="text-gray-600 text-lg">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some products to get started</p>
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 group animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full sm:w-32 h-32 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                          {item.quantity}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h3>
                          {/* <p className="text-sm text-gray-500 mb-3">ID: {item.productId}</p> */}
                          <p className="text-2xl font-bold text-blue-600">₹{item.price}</p>
                        </div>

                        {/* Quantity Controls & Actions */}
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-gray-100 rounded-xl p-1">
                            <button
                              onClick={() => handleDecrement(item.productId, item.quantity)}
                              disabled={updating}
                              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                              <Minus className="w-4 h-4 text-gray-700 group-hover:text-blue-600" />
                            </button>

                            <span className="w-12 text-center font-bold text-gray-900 text-lg">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => handleIncrement(item.productId, item.quantity)}
                              disabled={updating}
                              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                              <Plus className="w-4 h-4 text-gray-700 group-hover:text-blue-600" />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="flex-1 min-w-[120px]">
                            <p className="text-sm text-gray-600 mb-1">Item Total</p>
                            <p className="text-xl font-bold text-gray-900">
                              ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemove(item.productId)}
                            disabled={updating}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary - Sticky Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white sticky top-8 animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-4 border-b border-blue-500">
                      <span className="text-blue-100">Items ({totalItems})</span>
                      <span className="font-semibold text-lg">₹{subTotal}</span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-blue-500">
                      <span className="text-blue-100">Shipping</span>
                      <span className="font-semibold text-green-300">FREE</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xl font-bold">Total</span>
                      <span className="text-3xl font-bold">₹{subTotal}</span>
                    </div>
                  </div>

                  <button
                    className="w-full bg-white text-blue-600 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-2xl mb-4 flex items-center justify-center gap-2"
                    onClick={handleCartCheckout}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-blue-500 bg-opacity-30 text-white py-3 rounded-xl font-semibold hover:bg-opacity-40 transition-all duration-200"
                  >
                    Continue Shopping
                  </button>

                  {/* Promo Badge */}
                  <div className="mt-6 bg-blue-500 bg-opacity-30 rounded-xl p-4 text-center">
                    <p className="text-sm text-blue-100">🎉 Free shipping on all orders!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }

          .animate-slide-up {
            animation: slide-up 0.5s ease-out backwards;
          }
        `}</style>
      </div>
    </div>

  );
};

export default CartPage;
