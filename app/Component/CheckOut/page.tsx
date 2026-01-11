'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

import Navbar from '@/components/navbar';

interface Product {
  productId: string;
  image: string;
  title: string;
  price: string;
  quantity: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  
  // NEW: Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  // Load Razorpay script
  useEffect(() => {
    loadRazorpay();
  }, []);

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadRazorpay = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    document.head.appendChild(script);
  };

  const loadCheckoutData = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/');
        return;
      }
      
      const parsedUser = JSON.parse(userData) as User;
      setUser(parsedUser);
      
      const isBuyNow = searchParams.get('buyNow') === 'true';
      
      if (isBuyNow) {
        const productData: Product = {
          productId: searchParams.get('id') || '',
          image: searchParams.get('image') || '',
          title: searchParams.get('title') || '',
          price: searchParams.get('price') || '0',
          quantity: parseInt(searchParams.get('quantity') || '1')
        };
        setProducts([productData]);
      } else {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getcart/${parsedUser._id}`);
        setProducts(response.data.cart || []);
      }
      
      // NEW: Check if first order and calculate cart total
      const total = calculateTotal();
      setCartTotal(total);
      
      const firstOrderResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/check-first-order/${parsedUser._id}`
      );
      setIsFirstOrder(firstOrderResponse.data.isFirstOrder);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading checkout data:', error);
      setLoading(false);
    }
  };

  // NEW: Apply coupon logic
  const applyCoupon = async () => {
    if (!user) return;
    
    try {
      setCouponError('');
      
      // Check eligibility via API
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/apply-coupon`, {
        userId: user._id,
        cartTotal: calculateTotal(),
        couponCode: couponCode.toUpperCase()
      });
      
      if (response.data.success) {
        setCouponApplied(true);
        setCouponDiscount(response.data.discount);
        setCouponError('');
      } else {
        setCouponError(response.data.message);
        setCouponApplied(false);
        setCouponDiscount(0);
      }
    } catch (error: any) {
      setCouponError(error.response?.data?.message || 'Invalid coupon');
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  // NEW: Remove coupon
  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponCode('');
    setCouponError('');
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};
  
    if (!shippingAddress.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
  
    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(shippingAddress.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }
  
    if (!shippingAddress.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }
  
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
  
    if (!shippingAddress.state.trim()) {
      newErrors.state = 'State is required';
    }
  
    if (!shippingAddress.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback((field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);

  const calculateTotal = useCallback((): number => {
    const subtotal = products.reduce((total, product) => {
      return total + (parseFloat(product.price) * product.quantity);
    }, 0);
    
    // Apply discount if coupon is applied
    if (couponApplied && couponDiscount > 0) {
      return Math.max(0, subtotal - couponDiscount);
    }
    
    return subtotal;
  }, [products, couponApplied, couponDiscount]);

  // Get discount details for display
  const getDiscountDetails = () => {
    if (!couponApplied || couponDiscount === 0) return null;
    
    if (isFirstOrder) {
      return 'First Order Special: 10% OFF';
    } else if (cartTotal > 2000) {
      return 'Big Shopper: 15% OFF (Cart > ₹2000)';
    }
    
    return `Coupon Applied: Save ₹${couponDiscount.toFixed(2)}`;
  };

  // COD Order Handler
  const handleCODOrder = async () => {
    if (!validateForm() || !user) return;

    setSubmitting(true);
    
    try {
      const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const originalTotal = products.reduce((total, product) => {
        return total + (parseFloat(product.price) * product.quantity);
      }, 0);
      
      const orderData = {
        userId: user._id,
        orderId,
        orderItems: products,
        subTotal: originalTotal,
        discountAmount: couponDiscount,
        totalAmount: calculateTotal(),
        orderStatus: 'pending',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        shippingAddress,
        couponDiscount: couponDiscount
      };
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/placeorder`, orderData);
      
      if (response.data.success) {
        const isBuyNow = searchParams.get('buyNow') === 'true';
        if (!isBuyNow) {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clearcart/${user._id}`);
        }
        router.push(`/Component/Orders/OrderDetails?orderId=${orderId}`);
      }
    } catch (error) {
      console.error('Error placing COD order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Razorpay Order Handler (unchanged)
  const handleRazorpayOrder = async () => {
    if (!validateForm() || !user || !razorpayLoaded) return;

    setSubmitting(true);
    
    try {
      const originalTotal = products.reduce((total, product) => {
        return total + (parseFloat(product.price) * product.quantity);
      }, 0) * 100; // Convert to paise
      
      const options: any = {
        key: "rzp_test_S2KmVnYY70GNfF",
        amount: originalTotal,
        currency: 'INR',
        name: 'Your Store',
        description: `Pay ₹${calculateTotal()} for your order`,
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingAddress.phone || user.phone || ''
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            setSubmitting(false);
            alert('Payment cancelled');
          }
        },
        handler: async function (response: any) {
          const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          const originalTotalAmount = products.reduce((total, product) => {
            return total + (parseFloat(product.price) * product.quantity);
          }, 0);
          
          const orderData = {
            userId: user._id,
            orderId,
            orderItems: products,
            subTotal: originalTotalAmount,
            discountAmount: couponDiscount,
            totalAmount: calculateTotal(),
            orderStatus: 'confirmed',
            paymentMethod: 'razorpay',
            paymentStatus: 'paid',
            paymentDetails: {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
            },
            shippingAddress,
            couponDiscount: couponDiscount
          };

          try {
            const placeOrderResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/placeorder`, 
              orderData
            );

            if (placeOrderResponse.data.success) {
              const isBuyNow = searchParams.get('buyNow') === 'true';
              if (!isBuyNow) {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clearcart/${user._id}`);
              }
              router.push(`/Component/Orders/OrderDetails?orderId=${orderId}`);
            }
          } catch (orderError) {
            console.error('Order creation failed:', orderError);
            alert('Payment successful but order creation failed. Contact support.');
          }
        }
      };

      const rzp: any = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setSubmitting(false);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'cod') {
      handleCODOrder();
    } else {
      handleRazorpayOrder();
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-xl mb-4">No items to checkout</p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* NEW: Coupon Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Apply Coupon</h2>
                
                {!couponApplied ? (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code (FIRST10 or BIG15)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-green-800">{getDiscountDetails()}</p>
                      <p className="text-sm text-green-700">Save ₹{couponDiscount.toFixed(2)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
                
                {couponError && (
                  <p className="text-red-500 text-sm mt-2">{couponError}</p>
                )}
                
                {/* Auto-suggest available coupons */}
                {(!couponApplied || !isFirstOrder) && (
                  <div className="mt-3 text-xs text-gray-500">
                    {isFirstOrder && '💎 FIRST10 - 10% OFF your first order'}
                    {!isFirstOrder && cartTotal > 2000 && ' 🛒 BIG15 - 15% OFF on orders above ₹2000'}
                  </div>
                )}
              </div>

              {/* Shipping Address Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                {/* ... existing address fields unchanged ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Address Line 1 *</label>
                    <input
                      type="text"
                      value={shippingAddress.addressLine1}
                      onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="House no., Building name"
                    />
                    {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Address Line 2</label>
                    <input
                      type="text"
                      value={shippingAddress.addressLine2}
                      onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Road name, Area, Colony (Optional)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="City"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="State"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Pincode *</label>
                    <input
                      type="text"
                      value={shippingAddress.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.pincode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />
                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                </div>
              </div>
              
              {/* Payment Method Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium">Cash on Delivery (COD)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'online')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium">Online (Card/UPI/Netbanking)</span>
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={submitting || !razorpayLoaded}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {submitting 
                  ? 'Processing...' 
                  : paymentMethod === 'cod' 
                    ? 'Place COD Order' 
                    : 'Pay Online'
                }
              </button>
            </form>
          </div>
          
          {/* Order Summary - UPDATED */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-4">
                {products.map((product, index) => (
                  <div key={index} className="flex gap-3 pb-3 border-b">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.title}</p>
                      <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                      <p className="text-sm font-semibold">₹{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{products.reduce((total, product) => total + (parseFloat(product.price) * product.quantity), 0).toFixed(2)}</span>
                </div>
                
                {couponApplied && couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Discount Applied:</span>
                    <span>-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
