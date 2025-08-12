'use client'; // This directive is necessary for client-side interactivity in Next.js App Router

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, MapPin, DollarSign, Calendar, FileText, Send, LogIn, Upload, Mail } from 'lucide-react'; // Icons for job details and form
import { motion, AnimatePresence, Variants } from 'framer-motion'; // Assuming Footer is in src/components/Footer.tsx
import { data } from 'framer-motion/client';

// Sample job data (replace with actual API fetch in a real app)
const sampleJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    salary: '$120,000 - $160,000',
    type: 'Full-Time',
    description: 'We are looking for a skilled software engineer to join our team. Responsibilities include developing high-quality software solutions, collaborating with cross-functional teams, and maintaining code integrity.',
    postedDate: '2023-10-01',
  },
  // Add more sample jobs as needed
];

// Variants for animations
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

const JobDetailsPage: React.FC = () => {
  const { data: session, status } = useSession();
  const params = useParams();
  const jobId = params?.id as string;

  const [job, setJob] = useState<any>(null);
  const [loading,setLoading]= useState<Boolean>(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    coverLetter: '',
    cv: null as File | null,
  });

  useEffect(() => {
    // Simulate fetching job by ID (replace with API call)
    const fetchJob=()=>{
      setLoading(true)
    fetch(`/api/job/${jobId}`).then(res=>res.json()).then(data=>setJob(data)).catch(err=>{
      console.log(err)
    }).finally(()=>setLoading(false))
    }
    fetchJob()
  }, [jobId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle application submission (e.g., send to backend with FormData for CV upload)
    
    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('userId', session?.user.id);
    submissionData.append('email', formData.email);
    submissionData.append('coverLetter', formData.coverLetter);
    if (formData.cv) submissionData.append('cv', formData.cv);
    for (const [key, value] of submissionData.entries()) {
      console.log(`${key}: ${value}`);
    }
    fetch(`/api/job/${job.id}/apply`,{method:"POST", body:submissionData})
    .then(res=>res.json()).then(data=>{console.log(data);
    setFormData(prev=>({...prev, name:"",email:"", coverLetter:""}))
    })
    .catch(err=>console.error(err))
    // In a real app, use fetch or axios to post to an API endpoint
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, cv: file }));
  };

  if (status === 'loading' || loading) {
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
  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 font-inter">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-white text-lg font-semibold"
        >
          Error fetching job data
        </motion.div>
      </div>
    );
  }

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
            Please sign in to apply for this job.
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
        {/* Hero Section with Job Title */}
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
              {job.title}
            </h1>
            <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
              {job.company} - {job.location}
            </p>
          </div>
        </section>

        {/* Job Details Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-2xl p-8 md:p-10 transform transition-all duration-300 ease-in-out hover:shadow-3xl mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Job Details</h2>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Briefcase className="h-6 w-6 text-indigo-600 mr-4" />
                  <p className="text-gray-700"><span className="font-semibold">Company:</span> {job.company}</p>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-indigo-600 mr-4" />
                  <p className="text-gray-700"><span className="font-semibold">Location:</span> {job.location}</p>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-6 w-6 text-indigo-600 mr-4" />
                  <p className="text-gray-700"><span className="font-semibold">Salary:</span> {job.salary}</p>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-indigo-600 mr-4" />
                  <p className="text-gray-700"><span className="font-semibold">Job Type:</span> {job.type}</p>
                </div>
                <div className="flex items-start">
                  <FileText className="h-6 w-6 text-indigo-600 mr-4 mt-1" />
                  <p className="text-gray-700"><span className="font-semibold">Description:</span> {job.description}</p>
                </div>
              </div>
            </motion.div>

            {/* Application Form */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-2xl p-8 md:p-10 transform transition-all duration-300 ease-in-out hover:shadow-3xl"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Apply for this Job</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black transition duration-200"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="coverLetter" className="sr-only">Cover Letter</label>
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows={6}
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                    placeholder="Cover Letter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="cv" className="sr-only">Upload CV</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Upload className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="cv"
                    name="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 text-black border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                    onChange={handleFileChange}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 transform hover:scale-105"
                >
                  <Send className="h-5 w-5 mr-2" /> Apply Now
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default JobDetailsPage;