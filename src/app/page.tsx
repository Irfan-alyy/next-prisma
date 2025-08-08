'use client'; // This directive is necessary for client-side interactivity in Next.js App Router

import React, { useState } from 'react';
import Link from 'next/link';

// Navbar component (re-used from previous interaction)


// Home Page Component
const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20 md:py-32 overflow-hidden rounded-b-lg shadow-xl">
          <div className="absolute inset-0 z-0 opacity-10">
            {/* Background pattern - simple circles */}
            <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <circle cx="20" cy="20" r="15" fill="currentColor" className="text-indigo-400"></circle>
              <circle cx="80" cy="50" r="25" fill="currentColor" className="text-purple-400"></circle>
              <circle cx="50" cy="80" r="10" fill="currentColor" className="text-indigo-300"></circle>
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
              Discover Your Next Career Opportunity
            </h1>
            <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
              Connecting talented individuals with leading companies. Your dream job is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/jobs" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 shadow-lg transition duration-300 transform hover:scale-105">
                Find Jobs
                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="/post-job" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 md:py-4 md:text-lg md:px-10 shadow-lg transition duration-300 transform hover:scale-105">
                Post a Job
                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-12">
              Why Choose JobBoard?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                <div className="flex justify-center mb-4">
                  <svg className="h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Job Search</h3>
                <p className="text-gray-600">
                  Quickly find relevant job openings with our powerful search filters and intuitive interface.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                <div className="flex justify-center mb-4">
                  <svg className="h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.146-1.284-.42-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.146-1.284.42-1.857m0 0a2 2 0 113.364 0M7.42 16.143a2 2 0 103.364 0m-7.788-2.314h4.372c.585 0 1.137.213 1.565.582m-4.372-.582a2 2 0 10-.722 2.918m0 0H3a2 2 0 01-2-2V7a2 2 0 012-2h3.586a1 1 0 00.707-.293l1.414-1.414A1 1 0 019.586 3h4.828a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H21a2 2 0 012 2v3a2 2 0 01-2 2h-4.372m-7.788-2.314a2 2 0 10-.722 2.918" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect with Top Companies</h3>
                <p className="text-gray-600">
                  Access a curated list of opportunities from reputable companies across various industries.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                <div className="flex justify-center mb-4">
                  <svg className="h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Simple Application Process</h3>
                <p className="text-gray-600">
                  Apply for jobs effortlessly with our streamlined application forms and resume submission.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-purple-700 to-indigo-600 py-16 text-white rounded-t-lg shadow-xl">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
              Ready to Take the Next Step?
            </h2>
            <p className="text-lg sm:text-xl mb-10 opacity-90">
              Join thousands of job seekers and employers on JobBoard today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/auth/login" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 shadow-lg transition duration-300 transform hover:scale-105">
                Sign Up Now
                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="/jobs" className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-indigo-600 md:py-4 md:text-lg md:px-10 shadow-lg transition duration-300 transform hover:scale-105">
                Explore All Jobs
                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
