
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} JobBoard. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <Link href="/privacy-terms" className="hover:underline hover:text-indigo-400 transition duration-200">
            Privacy Policy
          </Link>
          <Link href="/privacy-terms" className="hover:underline hover:text-indigo-400 transition duration-200">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;