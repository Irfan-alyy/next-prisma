'use client'; // This directive is necessary for client-side interactivity in Next.js App Router

import React, { useState } from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, DollarSign, FileText, Send, LogIn } from 'lucide-react'; // Importing icons from lucide-react
import { motion, AnimatePresence, Variants } from 'framer-motion'; // Importing framer-motion for animations
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

// Animation variants for form card
const cardVariants:Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const itemVariants:Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const buttonVariants: Variants = {
  hidden: { y: 20, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut', type: 'spring', stiffness: 120 },
  },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

const PostJobPage: React.FC = () => {
  const {data:session, status}=useSession()
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    contract: '',
    description: '',
  });

const router= useRouter()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Job Posting Data:', formData);
    fetch("/api/job", {method:"POST", body:JSON.stringify({postedById:session?.user?.id,...formData})}).then(res=>
      res.json()
    ).then(()=>{
      setFormData({
        title: '',
        company: '',
        location: '',
        salary: '',
        contract: '',
        description: '',
      });
      toast.success("Job created Successfully")
    }
    ).catch(err=>{
      toast.error("Error occured Posting Job")
      console.error("Error occured posting job", err);
    })
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
    // Show loading state while session is being fetched
    if (status === 'loading') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-inter">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-lg"
          >
            Loading...
          </motion.div>
        </div>
      );
    }
    // Show login prompt if user is not authenticated
    if (!session?.user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 font-inter relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-10">
            <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <circle cx="20" cy="20" r="15" fill="currentColor" className="text-indigo-300"></circle>
              <circle cx="80" cy="50" r="25" fill="currentColor" className="text-purple-300"></circle>
              <circle cx="50" cy="80" r="10" fill="currentColor" className="text-indigo-200"></circle>
            </svg>
          </div>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-3xl p-8 md:p-12 max-w-lg text-center transform transition-all duration-300 ease-in-out hover:shadow-4xl border-2 border-transparent bg-clip-padding border-gradient-to-r from-indigo-500 to-purple-600 relative z-10"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-extrabold text-gray-900 mb-6"
            >
              Sign In Required
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-700 text-lg mb-8"
            >
              Please sign in to post a job and reach top talent on JobBoard.
            </motion.p>
            <motion.div variants={buttonVariants} whileHover="hover">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 shadow-lg transition duration-300 transform"
              >
                <LogIn className="h-6 w-6 mr-3" />
                Go to Login
              </Link>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    if(session?.user?.type!=="employer"){
      return (
        <div className="max-h-screen bg-gray-50 pt-6 pb-6">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
          <div className="text-center">
            {/* Lock Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            {/* Title */}
            <h2 className="mt-4 text-xl font-bold text-gray-900">Access Restricted</h2>
            
            {/* Message */}
            <p className="mt-2 text-gray-600">
              You need to be registered as an <span className="font-semibold text-indigo-600">Employer</span> to post jobs.
            </p>
            
            {/* Current Role Info */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Current role: <span className="font-medium capitalize text-gray-900">{session?.user?.type || 'Not set'}</span>
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/dashboard/profile')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Update Profile
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Dashboard
              </button>
            </div>
            
            {/* Additional Info */}
            <div className="mt-6 text-xs text-gray-500">
              <p>Dont have an employer account? Update your profile to switch roles.</p>
            </div>
          </div>
        </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20 md:py-28 overflow-hidden rounded-b-lg shadow-xl">
          <div className="absolute inset-0 z-0 opacity-10">
            {/* Background pattern - matching homepage and jobs page circles */}
            <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <circle cx="20" cy="20" r="15" fill="currentColor" className="text-indigo-400"></circle>
              <circle cx="80" cy="50" r="25" fill="currentColor" className="text-purple-400"></circle>
              <circle cx="50" cy="80" r="10" fill="currentColor" className="text-indigo-300"></circle>
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
              Post a Job Opening
            </h1>
            <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
              Attract top talent by posting your job listing with JobBoard.
            </p>
          </div>
        </section>

        {/* Job Posting Form Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key="jobPostForm"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-xl shadow-2xl p-8 md:p-10 transform transition-all duration-300 ease-in-out hover:shadow-3xl"
              >
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl font-bold text-center text-gray-800 mb-8"
                >
                  Create a New Job Listing
                </motion.h2>

                <motion.form
                  onSubmit={handleSubmit}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.3,
                      },
                    },
                  }}
                  className="space-y-6"
                >
                  {/* Job Title */}
                  <motion.div variants={itemVariants} className="relative">
                    <label htmlFor="title" className="sr-only">Job Title</label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      className="appearance-none text-black/60 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                      placeholder="Job Title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </motion.div>

                  {/* Company Name */}
                  <motion.div variants={itemVariants} className="relative">
                    <label htmlFor="company" className="sr-only">Company Name</label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                      className="appearance-none text-black/60 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </motion.div>

                  {/* Location */}
                  <motion.div variants={itemVariants} className="relative">
                    <label htmlFor="location" className="sr-only">Location</label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      className="appearance-none text-black/60 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                      placeholder="Location (e.g., San Francisco, CA or Remote)"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </motion.div>

                  {/* Salary */}
                  <motion.div variants={itemVariants} className="relative">
                    <label htmlFor="salary" className="sr-only">Salary Range</label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="salary"
                      name="salary"
                      type="text"
                      className="appearance-none text-black/60 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                      placeholder="Salary Range (e.g., $80,000 - $120,000)"
                      value={formData.salary}
                      onChange={handleInputChange}
                    />
                  </motion.div>

                  {/* Job Type */}
                  <motion.div variants={itemVariants} className="relative">
                    <label htmlFor="type" className="sr-only">Job Type</label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <select
                      id="type"
                      name="contract"
                      required
                      className="appearance-none text-black/60 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                      value={formData.contract}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select Job Type</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </motion.div>

                  {/* Job Description */}
                  <motion.div variants={itemVariants} className="relative">
                    <label htmlFor="description" className="sr-only">Job Description</label>
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      required
                      className="appearance-none text-black/60 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                      placeholder="Job Description (include responsibilities, requirements, etc.)"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    variants={itemVariants}
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 transform hover:scale-105"
                  >
                    <Send className="h-5 w-5 mr-2" /> Post Job
                  </motion.button>
                </motion.form>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-purple-700 to-indigo-600 py-16 text-white rounded-t-lg shadow-xl">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
              Need to Post More Jobs?
            </h2>
            <p className="text-lg sm:text-xl mb-10 opacity-90">
              Sign up for an employer account to manage all your job listings.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 shadow-lg transition duration-300 transform hover:scale-105"
            >
              Sign Up Now
              <svg
                className="ml-2 -mr-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </section>
        <ToastContainer/>
      </main>
    </div>
  );
};

export default PostJobPage;