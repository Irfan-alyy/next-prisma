'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Briefcase, MapPin, DollarSign, Calendar, FileText, Edit, Check, X, User, Mail, Eye } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import UpdateModal from '@/components/UpdateModal';
import DetailsModal from '@/components/DetailsModal';


// Animation variants
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut', type: 'spring', stiffness: 120 } },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  contract: string;
  description: string;
  postedAt: string;
  postedById: string;
}

interface Application {
  id: string;
  userId: string;
  description: string;
  resume: string;
  appliedAt: string;
  status: string;
  applicant: { name: string; email: string };
}

const JobDetailPage: React.FC = () => {
  const { data: session, status } = useSession();
  const params = useParams();
  const jobId = params.id as string;
  const router= useRouter()
  

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [detailsModal, setDetailsModal] = useState<{ isOpen: boolean; data: Application | null }>({
    isOpen: false,
    data: null,
  });

  useEffect(() => {
    const fetchJobAndApplications = async () => {
      if (!session?.user?.id) return;
      setLoading(true);
      try {
        // Fetch job details
        const jobRes = await fetch(`/api/job/${jobId}`);
        const jobData = await jobRes.json();
        if (jobData.postedById !== session.user.id) {
          // Unauthorized
          router.push('/dashboard');
          return;
        }
        setJob(jobData);

        // Fetch applications for this job
        const appsRes = await fetch(`/api/job/${jobId}/applications`);
        const appsData = await appsRes.json();
        setApplications(appsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobAndApplications();
  }, [jobId, session]);

  const handleUpdateJob = async (updatedJob: Job) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJob),
      });
      if (res.ok) {
        setJob(await res.json());
      }
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleAction = async (jobId:string,appId: string, newStatus: 'Accepted' | 'Rejected') => {
    try {
      const res = await fetch(`/api/job/${jobId}/applications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({appId:appId, status: newStatus }),
      });
      if (res.ok) {
        // Update local state
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
        );
        // The API will handle sending the email
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const handleViewApplication = (app: Application) => {
    setDetailsModal({ isOpen: true, data: app });
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-inter">
        <p className="text-gray-600 text-lg">Job not found or unauthorized.</p>
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Job Details</h2>
                <button
                  onClick={() => setUpdateModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Job
                </button>
              </div>
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
                  <p className="text-gray-700"><span className="font-semibold">Contract:</span> {job.contract}</p>
                </div>
                <div className="flex items-start">
                  <FileText className="h-6 w-6 text-indigo-600 mr-4 mt-1" />
                  <p className="text-gray-700"><span className="font-semibold">Description:</span> {job.description}</p>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-indigo-600 mr-4" />
                  <p className="text-gray-700"><span className="font-semibold">Posted:</span> {new Date(job.postedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>

            {/* Applications Section */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-2xl p-8 md:p-10 transform transition-all duration-300 ease-in-out hover:shadow-3xl"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Applications</h2>
              {applications.length === 0 ? (
                <p className="text-gray-600 text-center">No applications yet.</p>
              ) : (
                <div className="space-y-6">
                  {applications.map((app) => (
                    <motion.div
                      key={app.id}
                      variants={cardVariants}
                      className="border border-gray-200 rounded-md p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{app.applicant.name}</h3>
                          <p className="text-gray-600 flex items-center">
                            <Mail className="h-5 w-5 mr-2" />
                            {app.applicant.email}
                          </p>
                          <p className="text-gray-500 text-sm flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            {app.applicant.name}
                          </p>
                          <p className="text-gray-500 text-sm">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                          <p className="text-gray-500 text-sm">Status: {app.status}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewApplication(app)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          {app.resume && (
                            <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                              <FileText className="h-5 w-5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleAction(jobId,app.id, 'Accepted')}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleAction(jobId,app.id, 'Rejected')}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <UpdateModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        type="job"
        data={job}
        onSubmit={handleUpdateJob}
      />

      <DetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, data: null })}
        type="application"
        data={detailsModal.data}
      />
    </div>
  );
};

export default JobDetailPage;