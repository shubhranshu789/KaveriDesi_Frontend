import React from 'react'
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

// import "../../../public/Images/logo.png"

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-red-900 to-red-950 text-amber-50 py-16">
      <div className="container mx-auto px-4">
        {/* Top Section - Logo and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/Images/logo.png" 
                alt="Kaveri Desi Logo" 
                className="w-12 h-12 object-contain"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold text-amber-100 tracking-wider">KAVERI</span>
                <span className="text-sm font-semibold text-amber-100">देशी</span>
              </div>
            </div>
            <p className="text-amber-100 text-sm leading-relaxed">
              Pure, fresh milk delivered to your doorstep. Experience authentic dairy excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-amber-100 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-amber-50 hover:text-amber-200 transition">Home</Link></li>
              <li><Link href="/products" className="text-amber-50 hover:text-amber-200 transition">Products</Link></li>
              <li><Link href="/about" className="text-amber-50 hover:text-amber-200 transition">About Us</Link></li>
              <li><Link href="/contact" className="text-amber-50 hover:text-amber-200 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-lg font-bold text-amber-100 mb-4">Help & Support</h4>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-amber-50 hover:text-amber-200 transition">FAQ</Link></li>
              <li><Link href="/shipping" className="text-amber-50 hover:text-amber-200 transition">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-amber-50 hover:text-amber-200 transition">Returns</Link></li>
              <li><Link href="/privacy" className="text-amber-50 hover:text-amber-200 transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-amber-100 mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-200 mt-1" />
                <div>
                  <p className="text-amber-50">+91 9876543210</p>
                  <p className="text-amber-200 text-sm">Available 24/7</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-200 mt-1" />
                <p className="text-amber-50">support@kaveridesi.com</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-200 mt-1" />
                <p className="text-amber-50">Delhi NCR, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Newsletter */}
        {/* <div className="bg-red-800 bg-opacity-50 rounded-lg p-6 mb-12">
          <div className="max-w-md">
            <h4 className="text-lg font-bold text-amber-100 mb-2">Subscribe to Updates</h4>
            <p className="text-amber-50 text-sm mb-4">Get fresh milk delivery updates and exclusive offers</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none"
              />
              <button className="bg-amber-200 hover:bg-amber-300 text-red-900 font-bold px-6 py-2 rounded-lg transition">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}

        {/* Social Media & Divider */}
        <div className="border-t border-red-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Social Icons */}
            <div className="flex gap-4 mb-6 md:mb-0">
              <a href="#" className="bg-red-800 hover:bg-amber-200 hover:text-red-900 text-amber-50 p-3 rounded-full transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-red-800 hover:bg-amber-200 hover:text-red-900 text-amber-50 p-3 rounded-full transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-red-800 hover:bg-amber-200 hover:text-red-900 text-amber-50 p-3 rounded-full transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-red-800 hover:bg-amber-200 hover:text-red-900 text-amber-50 p-3 rounded-full transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright & Legal */}
            <div className="text-center md:text-right">
              <p className="text-amber-200 text-sm">
                © 2025 Kaveri Desi. All rights reserved.
              </p>
              <p className="text-amber-300 text-xs mt-2">
                Terms of Service • Privacy Policy • Cookie Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
