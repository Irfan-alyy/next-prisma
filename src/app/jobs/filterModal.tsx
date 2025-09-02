"use client";

import { FilterIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const FilterModal = ({ search}: { search: string;}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [filter, setFilter] = useState({
    salaryMin: "",
    salaryMax: "",
    jobType: "",
    location: "",
    experienceLevel: "",
    remote: false,
  });
  const searchParams= useSearchParams()
  const router= useRouter()

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value, type } = e.target;
    setFilter({ ...filter, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value });
  };

  const handleSalaryChange = (min: string, max: string) => {
    setFilter({ ...filter, salaryMin: min, salaryMax: max });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentParams= new URLSearchParams(searchParams.toString())

    if(!search){
       currentParams.delete("search") 
    }
    currentParams.delete("page")
    if (filter.salaryMin) currentParams.set("salaryMin", filter.salaryMin);
    else currentParams.delete("salaryMin");

    if (filter.salaryMax) currentParams.set("salaryMax", filter.salaryMax);
    else currentParams.delete("salaryMax");

    if (filter.location) currentParams.set("location", filter.location);
    else currentParams.delete("location");

    if (filter.jobType) currentParams.set("jobType", filter.jobType);
    else currentParams.delete("jobType");

    if (filter.experienceLevel) currentParams.set("experienceLevel", filter.experienceLevel);
    else currentParams.delete("experienceLevel");

    if (filter.remote) currentParams.set("remote", "true");
    else currentParams.delete("remote");

    const newUrl= `${window.location.pathname}?${currentParams.toString()}`
    console.log(newUrl);
    router.push(newUrl,{scroll:false})
    setShowModal(false);
  };

  const handleReset = () => {
    setFilter({
      salaryMin: "",
      salaryMax: "",
      jobType: "",
      location: "",
      experienceLevel: "",
      remote: false,
    });
  };

  return (
    <div className={`relative`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
        onClick={() => setShowModal(true)}
        aria-label="Open filters"
      >
        <FilterIcon className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-4/7 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                w-[95%] sm:w-[90%] md:w-[80%] lg:w-[40%] max-h-[85vh] overflow-y-auto 
                bg-white rounded-2xl shadow-xl z-50 p-6 sm:p-8 scrollbar-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Job Filters</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <fieldset className=" flex flex-col items-start space-y-3">
                  <label className="text-sm font-medium text-gray-700">Salary Range ($)</label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      name="salaryMin"
                      value={filter.salaryMin}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      name="salaryMax"
                      value={filter.salaryMax}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </fieldset>

                <fieldset className="space-y-3  flex flex-col items-start">
                  <label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={filter.location}
                    onChange={handleFilterChange}
                    placeholder="e.g., New York, NY"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </fieldset>

                <fieldset className="space-y-3  flex flex-col items-start">
                  <label htmlFor="jobType" className="text-sm font-medium text-gray-700">
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    id="jobType"
                    value={filter.jobType}
                    onChange={handleFilterChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Job Types</option>
                    <option value="fullTime">Full Time</option>
                    <option value="partTime">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                  </select>
                </fieldset>

                <fieldset className="space-y-3  flex flex-col items-start">
                  <label htmlFor="experienceLevel" className="text-sm font-medium text-gray-700">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    id="experienceLevel"
                    value={filter.experienceLevel}
                    onChange={handleFilterChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                  </select>
                </fieldset>

                <fieldset className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="remote"
                    id="remote"
                    checked={filter.remote}
                    onChange={handleFilterChange}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remote" className="text-sm font-medium text-gray-700">
                    Remote Only
                  </label>
                </fieldset>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterModal;