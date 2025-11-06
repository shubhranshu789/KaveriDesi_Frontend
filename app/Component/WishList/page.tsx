// components/Wishlist.tsx
'use client'; // if using Next.js App Router

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/navbar"

interface WishlistItem {
    productId: string;
    image: string;
    title: string;
    price: string;
    addedAt: string;
    _id: string;
}

interface WishlistProps {
    userId?: string;
}

export default function Wishlist({ userId }: WishlistProps) {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [removingItemId, setRemovingItemId] = useState<string | null>(null);
    const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchWishlist();
    }, [userId]);

    // Auto-hide success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            setError(null);

            const userString = localStorage.getItem('user');
            if (!userString) {
                alert('Please login first');
                 router.push('/');
                return;
            }
            const user = JSON.parse(userString);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getwishlist/${user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch wishlist');
            }

            const data = await response.json();

            if (data.success) {
                setWishlist(data.wishlist || []);
            } else {
                throw new Error('Failed to load wishlist');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching wishlist:', err);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId: string, itemId: string) => {
        try {
            setRemovingItemId(itemId);
            setError(null);

            const userString = localStorage.getItem('user');
            if (!userString) {
                alert('Please login first');
                return;
            }
            const user = JSON.parse(userString);
            const id = user._id

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/removefromwishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: id,
                    productId: productId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove item');
            }

            const data = await response.json();

            if (data.success) {
                // Optimistically update UI
                setWishlist(data.wishlist || []);
                setSuccessMessage('Item removed from wishlist');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove item');
            console.error('Error removing from wishlist:', err);
        } finally {
            setRemovingItemId(null);
        }
    };

    const addToCart = async (item: WishlistItem) => {
        try {
            setAddingToCartId(item._id);
            setError(null);

            const userString = localStorage.getItem('user');
            if (!userString) {
                alert('Please login first');
                return;
            }
            const user = JSON.parse(userString);
            const id = user._id

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addtocart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: id,
                    productId: item.productId,
                    image: item.image,
                    title: item.title,
                    price: item.price,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add to cart');
            }

            const data = await response.json();

            if (data.success) {
                setSuccessMessage('Item added to cart successfully!');
                // Optionally remove from wishlist after adding to cart
                // await removeFromWishlist(item.productId, item._id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add to cart');
            console.error('Error adding to cart:', err);
        } finally {
            setAddingToCartId(null);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && wishlist.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen p-8">
                <div className="max-w-md w-full bg-red-50 border-2 border-red-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-red-800">Error Loading Wishlist</h3>
                    </div>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => fetchWishlist()}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (wishlist.length === 0) {
        return (
            <div>
                <Navbar/>
                <div className="flex items-center justify-center min-h-screen p-8">
                    
                    <div className="text-center max-w-md">
                        <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h2>
                        <p className="text-gray-600 mb-6">Start adding items to your wishlist to see them here!</p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Browse Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar/>
            <div className="container mx-auto px-4 py-8">
                {/* Success Message */}
                {successMessage && (
                    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-down">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {successMessage}
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span>{error}</span>
                            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                    <p className="text-gray-600">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="relative pb-[100%] bg-gray-100">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                    }}
                                />
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {item.title}
                                </h3>

                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-2xl font-bold text-blue-600">₹{item.price}</span>
                                </div>

                                <p className="text-xs text-gray-500 mb-4">
                                    Added on {new Date(item.addedAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                                        onClick={() => addToCart(item)}
                                        disabled={addingToCartId === item._id}
                                    >
                                        {addingToCartId === item._id ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Adding...
                                            </>
                                        ) : (
                                            'Add to Cart'
                                        )}
                                    </button>

                                    <button
                                        className="p-2 border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        onClick={() => removeFromWishlist(item.productId, item._id)}
                                        disabled={removingItemId === item._id}
                                        title="Remove from wishlist"
                                    >
                                        {removingItemId === item._id ? (
                                            <svg className="animate-spin h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>


    );
}
