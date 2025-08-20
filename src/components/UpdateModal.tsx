'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, Variants } from 'framer-motion';
import { X, Briefcase, MapPin, DollarSign, FileText, Upload } from 'lucide-react';

interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  contract: string;
  description: string;
}

interface ApplicationData {
  id: string;
  coverLetter: string;
  status?: string; // Only for employers updating application status
}

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'job' | 'application';
  data: JobData | ApplicationData;
  onSubmit: (data: JobData | ApplicationData) => void;
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, type, data, onSubmit }) => {
  const { data: session } = useSession();
  const isEmployer = 'employer'; // Assume user model has a role field
  const [formData, setFormData] = useState<JobData | ApplicationData>(data);
  const [cvFile, setCvFile] = useState<File | null>(null);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCvFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });
    if (cvFile) submissionData.append('cv', cvFile);
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-inter">
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
          {type === 'job' ? 'Update Job' : 'Update Application'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'job' ? (
            <>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <div className="relative">
                  <Briefcase className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={(formData as JobData).title}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <div className="relative">
                  <Briefcase className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={(formData as JobData).company}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={(formData as JobData).location}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                  Salary
                </label>
                <div className="relative">
                  <DollarSign className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    id="salary"
                    name="salary"
                    type="text"
                    value={(formData as JobData).salary}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contract" className="block text-sm font-medium text-gray-700">
                  Contract Type
                </label>
                <div className="relative">
                  <FileText className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    id="contract"
                    name="contract"
                    type="text"
                    value={(formData as JobData).contract}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <textarea
                    id="description"
                    name="description"
                    value={(formData as JobData).description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="pl-10 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                  Cover Letter
                </label>
                <div className="relative">
                  <FileText className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={(formData as ApplicationData).coverLetter}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="pl-10 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="cv" className="block text-sm font-medium text-gray-700">
                  Upload New CV (optional)
                </label>
                <div className="relative">
                  <Upload className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    id="cv"
                    name="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="pl-10 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              {isEmployer && (
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="relative">
                    <FileText className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                    <select
                      id="status"
                      name="status"
                      value={(formData as ApplicationData).status || 'Pending'}
                      onChange={handleInputChange}
                      className="pl-10 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-lg hover:bg-gray-400 transition duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateModal;