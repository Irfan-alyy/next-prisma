// components/Navbar.tsx
'use client'; // This directive is necessary for client-side interactivity in Next.js App Router

import React, { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import {UserCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

// const mobileMenuVariants: Variants = {
//   hidden: { opacity: 0, height: 0 },
//   visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
// };


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen]=useState(false)
  const session= useSession()

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              JobBoard
            </Link>
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link href="/jobs" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Find Jobs
            </Link>
            {session.status==="authenticated" && session.data?.user?.type=="employer" &&<Link href="/post-job" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Post a Job
            </Link>}
            <Link href="/about" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>
            {session.status==="authenticated" &&
            <button onClick={()=>setIsDropdownOpen(!isDropdownOpen)} className='text-gray-700 hover:text-indigo-600 '>
            <UserCircle className='h-6 w-6' />
            </button>}
            


            {session.status!=="authenticated" && session.status!=="loading"  && <Link href="/auth/signin" className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-300">
              Sign In
            </Link>}

          </div>
          {session.status==="authenticated" && isDropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute right-0 mt-40 w-48 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-200"
                  >
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LayoutDashboard className="h-5 w-5 mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}


          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed. */}
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                /* Icon when menu is open. */
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/jobs"
            className="block text-gray-700 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)} // Close menu on click
          >
            Find Jobs
          </Link>
          <Link
            href="/post-job"
            className="block text-gray-700 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)} // Close menu on click
          >
            Post a Job
          </Link>
          <Link
            href="/about"
            className="block text-gray-700 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)} // Close menu on click
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="block text-gray-700 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)} // Close menu on click
          >
            Contact
          </Link>
            {session.status==="authenticated" ?(
            <div className='flex w-full justify-between'>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2  transition duration-200"
                  onClick={()=>setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' });
                    ()=>setIsOpen(false);
                  }}
                  className="text-gray-700 hover:text-indigo-600 px-5 py-2  text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2  transition duration-200"
                  onClick={()=>setIsOpen(false)}
                >
                  Sign In
                </Link>
              </div>)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;