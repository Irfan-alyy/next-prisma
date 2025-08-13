'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { User, Briefcase, FileText, Edit, Trash2, LogIn } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Mock data (replace with API calls)
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/avatar-placeholder.png',
};

const mockJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    status: 'Active',
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Web Solutions',
    location: 'Remote',
    status: 'Closed',
  },
];

const mockApplications = [
  {
    id: '1',
    jobTitle: 'Senior Software Engineer',
    company: 'Tech Corp',
    appliedDate: '2023-10-01',
    status: 'Pending',
  },
  {
    id: '2',
    jobTitle: 'Frontend Developer',
    company: 'Web Solutions',
    appliedDate: '2023-10-05',
    status: 'Accepted',
  },
];

// Animation variants
const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const itemVariants: Variants = {
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

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'jobs' | 'applications'>('profile');
  const [user, setUser] = useState(mockUser);
  const [jobs, setJobs] = useState(mockJobs);
  const [applications, setApplications] = useState(mockApplications);

  useEffect(() => {
    // TODO: Fetch user data, jobs, and applications from API
        fetch('/api/user').then(res => res.json()).then(data=>setUser(data?.user));
        fetch('/api/user/jobs').then(res => res.json()).then(data=>setJobs(data?.jobs));
    // fetch('/api/user/applications').then(res => res.json()).then(setApplications);
  }, []);
  console.log(jobs);
  

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 font-inter">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-white text-lg font-semibold"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 font-inter relative overflow-hidden">
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
            Please sign in to access your dashboard.
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

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20 md:py-28 overflow-hidden rounded-b-lg shadow-xl">
          <div className="absolute inset-0 z-0 opacity-10">
            <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <circle cx="20" cy="20" r="15" fill="currentColor" className="text-indigo-400"></circle>
              <circle cx="80" cy="50" r="25" fill="currentColor" className="text-purple-400"></circle>
              <circle cx="50" cy="80" r="10" fill="currentColor" className="text-indigo-300"></circle>
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
              Your Dashboard
            </h1>
            <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
              Manage your profile, job listings, and applications all in one place.
            </p>
          </div>
        </section>

        {/* Tabbed Content */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tabs */}
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 text-base font-medium rounded-md shadow-sm transition duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-6 py-3 text-base font-medium rounded-md shadow-sm transition duration-200 ${
                  activeTab === 'jobs'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Jobs
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-6 py-3 text-base font-medium rounded-md shadow-sm transition duration-200 ${
                  activeTab === 'applications'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Applications
              </button>
            </div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-2xl p-8 md:p-10 transform transition-all duration-300 ease-in-out hover:shadow-3xl"
            >
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Profile</h2>
                  <div className="flex items-center justify-center mb-6">
                    <img
                      src={user?.image}
                      alt="User Avatar"
                      className="w-24 h-24 rounded-full shadow-md"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-6 w-6 text-indigo-600 mr-4" />
                      <p className="text-gray-700"><span className="font-semibold">Name:</span> {user.name}</p>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-indigo-600 mr-4" />
                      <p className="text-gray-700"><span className="font-semibold">Email:</span> {user.email}</p>
                    </div>
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition duration-300"
                    >
                      <Edit className="h-5 w-5 mr-2" />
                      Edit Profile
                    </motion.button>
                  </div>
                </div>
              )}

              {activeTab === 'jobs' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Job Listings</h2>
                  {jobs.length === 0 ? (
                    <p className="text-gray-600 text-center">You haven’t posted any jobs yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <motion.div
                          key={job.id}
                          variants={itemVariants}
                          className="border border-gray-200 rounded-md p-4 flex justify-between items-center"
                        >
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                            <p className="text-gray-600">{job.company} - {job.location}</p>
                            <p className="text-gray-500 text-sm">Status: {job.status}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-800">
                              <Edit className="h-5 w-5" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <Link
                    href="/post-job"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition duration-300"
                  >
                    Post New Job
                  </Link>
                </div>
              )}

              {activeTab === 'applications' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Applications</h2>
                  {applications.length === 0 ? (
                    <p className="text-gray-600 text-center">You haven’t applied to any jobs yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <motion.div
                          key={app.id}
                          variants={itemVariants}
                          className="border border-gray-200 rounded-md p-4"
                        >
                          <h3 className="text-lg font-semibold text-gray-800">{app.jobTitle}</h3>
                          <p className="text-gray-600">{app.company}</p>
                          <p className="text-gray-500 text-sm">Applied: {app.appliedDate}</p>
                          <p className="text-gray-500 text-sm">Status: {app.status}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;