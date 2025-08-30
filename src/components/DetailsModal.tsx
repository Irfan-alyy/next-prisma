'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { X, Briefcase, MapPin, DollarSign, FileText, Calendar,  UserSquare } from 'lucide-react';
import { Job, Application } from '@/lib/types';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'job' | 'application';
  data: Partial<Job> | Partial<Application>;
}



const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

const DetailsModal: React.FC<DetailsModalProps> = ({ isOpen, onClose, type, data }) => {
  if (!isOpen) return null;
  return (
    <div className=" details-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-inter">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {type === 'job' ? 'Job Details' : 'Application Details'}
        </h2>
        {type === 'job' ? (
          <div className="space-y-4">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-indigo-600 mr-3" />
              <p className="text-gray-700">
                <span className="font-semibold">Title:</span> {(data as Job).title}
              </p>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-indigo-600 mr-3" />
              <p className="text-gray-700">
                <span className="font-semibold">Company:</span> {(data as Job).company}
              </p>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-indigo-600 mr-3" />
              <p className="text-gray-700">
                <span className="font-semibold">Location:</span> {(data as Job).location}
              </p>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-indigo-600 mr-3" />
              <p className="text-gray-700">
                <span className="font-semibold">Salary:</span> {(data as Job).salary}
              </p>
            </div>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-indigo-600 mr-3" />
              <p className="text-gray-700">
                <span className="font-semibold">Contract:</span> {(data as Job).contract}
              </p>
            </div>
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-indigo-600 mr-3 mt-1" />
              <p className="text-gray-700">
                <span className="font-semibold">Description:</span> {(data as Job).description}
              </p>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-indigo-600 mr-3" />
              <p className="text-gray-700">
                <span className="font-semibold">Posted:</span>{' '}
                {new Date((data as Job).postedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center">
              <UserSquare className="h-5 w-5 text-indigo-600 mr-3" />
              <p className="text-gray-700">
                <span className="font-semibold">Applicant Name:</span>{' '}
                {(data as Application).applicant?.name}
              </p>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-indigo-600 mr-3" />
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span>{' '}
                {(data as Application).applicant.email}
              </p>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-indigo-600 mr-3" />
              <p className="text-gray-700">
                <span className="font-semibold">Job Title:</span>{' '}
                {(data as Application).job.title}
              </p>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-indigo-600 mr-3" />
              <p className="text-gray-700">
                <span className="font-semibold">Company:</span>{' '}
                {(data as Application).job.company}
              </p>
            </div>
            <div className="flex items-start ml-8 ">
              <p className="text-gray-700">
                <span className="font-semibold">Cover Letter:</span>{' '}
                {(data as Application).description}
              </p>
            </div>
            {(data as Application).resume && (
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-indigo-600 mr-3" />
                <p className="text-gray-700">
                  <span className="font-semibold">CV:</span>{' '}
                  <a
                    href={(data as Application).resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    View CV
                  </a>
                </p>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-indigo-600 mr-3" />
              <p className="text-gray-700">
                <span className="font-semibold">Applied:</span>{' '}
                {new Date((data as Application).appliedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-indigo-600 mr-3" />
              <p className="text-gray-700">
                <span className="font-semibold">Status:</span> {(data as Application).status}
              </p>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DetailsModal;