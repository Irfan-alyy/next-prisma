"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  User,
  FileText,
  Edit,
  Trash2,
  LogIn,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import DetailsModal from "@/components/DetailsModal";
import Image from "next/image";
import LoadingSpinner from "@/components/spinners";
import { Application, Job } from "@/lib/types";
interface User {
  createdAt: Date;
  email: string;
  emailVerified: Date | null;
  id: string;
  image: string;
  name: string;
  updatedAt: Date;
  type: string;
}

// Animation variants
const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const buttonVariants: Variants = {
  hidden: { y: 20, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      type: "spring",
      stiffness: 120,
    },
  },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<
    "profile" | "jobs" | "applications"
  >("profile");
  const [user, setUser] = useState<User>();
  const [jobs, setJobs] = useState<Array<Job>>([]);
  const [applications, setApplications] = useState<Array<Application>>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [currentDetail, setCurrentDetail] = useState<Job | Application>();
  const [currentDetailType, setCurrentDetailType] = useState<
    "job" | "application"
  >("job");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "accepted" | "pending" | "rejected"
  >("all");
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalJPages, setTotalJPages] = useState<number>(1);
  const [totalAPages,setTotalAPages]=useState<number>(1)
  useEffect(() => {
    try {
      setLoading(true);
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => setUser(data?.user))
        .finally(() => setLoading(false));
    } catch (error: unknown) {
      console.log(
        "Error occured in fetching user data",
        (error as any)?.message
      );
    }
  }, []);

  const handleJobDelete = async (id: string) => {
    const response = await fetch(`/api/job/${id}`, { method: "DELETE" });
    if (response.ok) {
      toast.warning("Job Deleted Successfully");
      const remainingJobs = jobs.filter((job) => job.id !== id);
      setJobs(remainingJobs);
      return;
    }
    const data = await response.json();
    toast.error(data?.message || "Failed to delete Job");
  };

  const handleJobModalClose = () => {
    setIsDetailModalOpen(false);
  };

  const handleApplicationModal = (application: Application) => {
    setCurrentDetail(application);
    setCurrentDetailType("application");
    setIsDetailModalOpen(true);
  };

  const fetchApplications = () => {
    setLoading(true);
    fetch(`/api/user/applications?page=${currentPage}&pageSize=${pageSize}`)
      .then((res) => res.json())
      .then((data) => {
        setApplications(data?.applications);
        setFilteredApplications(data?.applications);
        setTotalAPages(data?.totalPages);
      })
      .finally(() => setLoading(false));
  };
  const fetchJobs = () => {
    setLoading(true);
    fetch(`/api/user/jobs?page=${currentPage}&pageSize=${pageSize}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data?.jobs);
        setTotalJPages(data?.totalPages);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    activeTab === "jobs" && fetchJobs();
    activeTab == "applications" && fetchApplications();
  }, [currentPage, pageSize]);



  const handleTabChange = (tab: string) => {
    switch (tab) {
      case "job":
        setCurrentPage(1);
        !!(jobs && jobs.length > 0) || fetchJobs();
        setActiveTab("jobs");
        break;
      case "application":
        setCurrentPage(1);
        !!(applications && applications.length > 0) || fetchApplications();
        setActiveTab("applications");
        break;
      default:
        setActiveTab("profile");
        break;
    }
  };

  if (status === "loading") {
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
          <svg
            className="w-full h-full"
            fill="none"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            <circle
              cx="20"
              cy="20"
              r="15"
              fill="currentColor"
              className="text-indigo-300"
            ></circle>
            <circle
              cx="80"
              cy="50"
              r="25"
              fill="currentColor"
              className="text-purple-300"
            ></circle>
            <circle
              cx="50"
              cy="80"
              r="10"
              fill="currentColor"
              className="text-indigo-200"
            ></circle>
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
              href="/auth/signin"
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
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid slice"
            >
              <circle
                cx="20"
                cy="20"
                r="15"
                fill="currentColor"
                className="text-indigo-400"
              ></circle>
              <circle
                cx="80"
                cy="50"
                r="25"
                fill="currentColor"
                className="text-purple-400"
              ></circle>
              <circle
                cx="50"
                cy="80"
                r="10"
                fill="currentColor"
                className="text-indigo-300"
              ></circle>
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
              Your Dashboard
            </h1>
            <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
              Manage your profile, job listings, and applications all in one
              place.
            </p>
          </div>
        </section>

        {/* Tabbed Content */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tabs */}
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => handleTabChange("profile")}
                className={`px-6 py-3 text-base font-medium rounded-md shadow-sm transition duration-200 ${
                  activeTab === "profile"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Profile
              </button>
              {(session?.user?.type == "employer" ||
                session?.user?.type == "admin") && (
                <button
                  onClick={() => handleTabChange("job")}
                  className={`px-6 py-3 text-base font-medium rounded-md shadow-sm transition duration-200 ${
                    activeTab === "jobs"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  My Jobs
                </button>
              )}
              {(session?.user?.type == "candidate" ||
                session?.user?.type == "admin") && (
                <button
                  onClick={() => handleTabChange("application")}
                  className={`px-6 py-3 text-base font-medium rounded-md shadow-sm transition duration-200 ${
                    activeTab === "applications"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  My Applications
                </button>
              )}
            </div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-2xl p-8 md:p-10 transform transition-all duration-300 ease-in-out hover:shadow-3xl"
            >
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Your Profile
                  </h2>
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className=" text-lg font-semibold text-black text-center"
                    >
                      <LoadingSpinner
                        variant="bars"
                        size="small"
                        className="text-indigo-600"
                      />
                    </motion.div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center mb-6">
                        {user?.image && (
                          <Image
                            width={96}
                            height={96}
                            src={user?.image as string}
                            alt="User Avatar"
                            className="object-cover w-24 h-24 rounded-full shadow-md"
                          />
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <User className="h-6 w-6 text-indigo-600 mr-4" />
                          <p className="text-gray-700">
                            <span className="font-semibold">Name:</span>{" "}
                            {user?.name}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-6 w-6 text-indigo-600 mr-4" />
                          <p className="text-gray-700">
                            <span className="font-semibold">Email:</span>{" "}
                            {user?.email}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-6 w-6 text-indigo-600 mr-4" />
                          <p className="text-gray-700">
                            <span className="font-semibold">User Type:</span>{" "}
                            {user?.type &&
                              user.type.charAt(0).toUpperCase() +
                                user.type.slice(1)}
                          </p>
                        </div>
                        <Link
                          href={"/dashboard/profile"}
                          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition duration-300"
                        >
                          <Edit className="h-5 w-5 mr-2" />
                          Edit Profile
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "jobs" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center w-full">
                    <h2 className="text-3xl font-bold text-gray-800 text-center">
                      Your Job Listings
                    </h2>
                    <Link
                      href="/post-job"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition duration-300"
                    >
                      Post New Job
                    </Link>
                  </div>
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-lg font-semibold text-black text-center"
                    >
                      <LoadingSpinner
                        variant="bars"
                        size="small"
                        className="text-indigo-600"
                      />
                    </motion.div>
                  ) : jobs?.length === 0 ? (
                    <p className="text-gray-600 text-center">
                      You haven’t posted any jobs yet.
                    </p>
                  ) : (
                    <div>
                      <div className="space-y-4">
                        {jobs.map((job) => (
                          <motion.div
                            key={job.id as string}
                            variants={itemVariants}
                            className="border border-gray-200 rounded-md p-4 flex justify-between items-center"
                          >
                            <Link
                              href={`/dashboard/job/${job.id}`}
                              className="cursor-pointer"
                            >
                              <h3 className="text-lg font-semibold text-gray-800">
                                {job.title}
                              </h3>
                              <p className="text-gray-600">
                                {job.company} - {job.location}
                              </p>
                              <p className="text-gray-500 text-sm">
                                Contract: {job.contract}
                              </p>
                            </Link>
                            <div className="flex space-x-2">
                              <button
                                title="delete"
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleJobDelete(job.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                     
                    </div>
                  )}
 <div className="flex flex-wrap items-center w-full justify-center">
                        {totalJPages > 0 && (
                          <div className="mt-12 flex justify-center flex-wrap px-5 sm:px-15 md:px-30 items-center">
                            {/* Previous Button */}
                            <div>
                              <button
                                onClick={() =>
                                  setCurrentPage((prev) => prev - 1)
                                }
                                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                                  currentPage === 1
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                } shadow-lg transition duration-300 transform`}
                              >
                                <ChevronLeft className="h-5 w-5 mr-2" />
                                Previous
                              </button>
                            </div>

                            {/* Page Numbers */}
                            {currentPage > 3 && (
                              <button
                                onClick={() => setCurrentPage(1)}
                                className={`px-4 mx-2 my-2 py-2 rounded-md text-sm font-medium
                   bg-white text-gray-700 hover:bg-gray-100'
                } shadow-lg transition duration-300 transform`}
                              >
                                First Page
                              </button>
                            )}

                            {currentPage > 3 && (
                              <div
                                className="px-4 mx-2 my-2 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100
                   shadow-lg transition duration-300 transform "
                              >
                                ...
                              </div>
                            )}
                            {Array.from(
                              { length: totalJPages },
                              (_, i) => i + 1
                            ).map((pageNum) => {
                              return pageNum < currentPage + 5 ? (
                                <div key={pageNum}>
                                  {currentPage - pageNum > 2 || (
                                    <button
                                      onClick={() => setCurrentPage(pageNum)}
                                      className={`px-4 py-2 mx-2 my-2 rounded-md text-sm font-medium ${
                                        pageNum === currentPage
                                          ? "bg-indigo-600 text-white"
                                          : "bg-white text-gray-700 hover:bg-gray-100"
                                      } shadow-lg transition duration-300 transform`}
                                    >
                                      {pageNum}
                                    </button>
                                  )}
                                </div>
                              ) : (
                                ""
                              );
                            })}
                            {currentPage + 5 < totalJPages && (
                              <div
                                className="px-4 mx-2 my-2 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100
                      } shadow-lg transition duration-300 transform "
                              >
                                ...
                              </div>
                            )}

                            {currentPage < totalJPages - 4 && (
                              <button
                                onClick={() => setCurrentPage(totalJPages)}
                                className={`px-4 mx-2  my-2 py-2 rounded-md text-sm font-medium
                                              bg-white text-gray-700 hover:bg-gray-100'
                                            } shadow-lg transition duration-300 transform`}
                              >
                                Last Page
                              </button>
                            )}
                            {/* Next Button */}
                            <div>
                              <button
                                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                                  currentPage === totalJPages
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                } shadow-lg transition duration-300 transform`}
                              >
                                Next
                                <ChevronRight className="h-5 w-5 ml-2" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                </div>
              )}

              {activeTab === "applications" && (
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                      Your Applications
                    </h2>
                    <div>
                      {applications?.length > 0 && (
                        <div className="flex gap-5 w-full justify-evenly text-black">
                          <button
                            onClick={() => {
                              setSelectedFilter("all");
                            }}
                            className={`inline-flex items-center justify-center w-25 py-2 ${
                              selectedFilter == "all"
                                ? "bg-indigo-600 text-white"
                                : "text-black"
                            }  rounded-md shadow-lg hover:bg-indigo-700 hover:text-white transition duration-300 transform hover:scale-105`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => {
                              setSelectedFilter("accepted");
                            }}
                            className={`inline-flex items-center justify-center w-25 py-2 ${
                              selectedFilter == "accepted"
                                ? "bg-indigo-600 text-white"
                                : "text-black"
                            } rounded-md shadow-lg hover:bg-indigo-700 hover:text-white transition duration-300 transform hover:scale-105`}
                          >
                            Accepted
                          </button>
                          <button
                            onClick={() => {
                              setSelectedFilter("pending");
                            }}
                            className={`inline-flex items-center justify-center w-25 py-2 ${
                              selectedFilter == "pending"
                                ? "bg-indigo-600 text-white"
                                : "text-black"
                            } rounded-md shadow-lg hover:bg-indigo-700 hover:text-white transition duration-300 transform hover:scale-105`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => {
                              setSelectedFilter("rejected");
                            }}
                            className={`inline-flex items-center justify-center w-25 py-2  ${
                              selectedFilter == "rejected"
                                ? "bg-indigo-600 text-white"
                                : "text-black"
                            }  rounded-md shadow-lg hover:bg-indigo-700 hover:text-white transition duration-300 transform hover:scale-105`}
                          >
                            Rejected
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-black text-lg font-semibold text-center"
                    >
                      <LoadingSpinner
                        variant="bars"
                        size="small"
                        className="text-indigo-600"
                      />
                    </motion.div>
                  ) : applications?.length === 0 ? (
                    <p className="text-gray-600 text-center">
                      You haven’t applied to any jobs yet.
                    </p>
                  ) : (
                    <div>
                      <div className="space-y-4">
                        {applications.map((app) => (
                          <motion.div
                            key={app.id as string}
                            variants={itemVariants}
                            onClick={() => handleApplicationModal(app)}
                            className="border border-gray-200 rounded-md p-4 cursor-pointer"
                          >
                            <h3 className="text-lg font-semibold text-gray-800">
                              {app.job?.title}
                            </h3>
                            <p className="text-gray-600">{app?.job?.company}</p>
                            <p className="text-gray-500 text-sm">
                              Applied At:{" "}
                              {new Date(app?.appliedAt)?.toLocaleString()}
                            </p>
                            <p className="text-gray-500 text-sm">
                              Status: {app?.status}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    
                    </div>
                  )}
                    <div className="flex flex-wrap items-center w-full justify-center">
                        {totalAPages > 0 && (
                          <div className="mt-12 flex justify-center flex-wrap px-5 sm:px-15 md:px-30 items-center">
                            {/* Previous Button */}
                            <div>
                              <button
                                onClick={() =>
                                  setCurrentPage((prev) => prev - 1)
                                }
                                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                                  currentPage === 1
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                } shadow-lg transition duration-300 transform`}
                              >
                                <ChevronLeft className="h-5 w-5 mr-2" />
                                Previous
                              </button>
                            </div>

                            {/* Page Numbers */}
                            {currentPage > 3 && (
                              <button
                                onClick={() => setCurrentPage(1)}
                                className={`px-4 mx-2 my-2 py-2 rounded-md text-sm font-medium
                   bg-white text-gray-700 hover:bg-gray-100'
                } shadow-lg transition duration-300 transform`}
                              >
                                First Page
                              </button>
                            )}

                            {currentPage > 3 && (
                              <div
                                className="px-4 mx-2 my-2 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100
                   shadow-lg transition duration-300 transform "
                              >
                                ...
                              </div>
                            )}
                            {Array.from(
                              { length: totalAPages },
                              (_, i) => i + 1
                            ).map((pageNum) => {
                              return pageNum < currentPage + 5 ? (
                                <div key={pageNum}>
                                  {currentPage - pageNum > 2 || (
                                    <button
                                      onClick={() => setCurrentPage(pageNum)}
                                      className={`px-4 py-2 mx-2 my-2 rounded-md text-sm font-medium ${
                                        pageNum === currentPage
                                          ? "bg-indigo-600 text-white"
                                          : "bg-white text-gray-700 hover:bg-gray-100"
                                      } shadow-lg transition duration-300 transform`}
                                    >
                                      {pageNum}
                                    </button>
                                  )}
                                </div>
                              ) : (
                                ""
                              );
                            })}
                            {currentPage + 5 < totalAPages && (
                              <div
                                className="px-4 mx-2 my-2 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100
                      } shadow-lg transition duration-300 transform "
                              >
                                ...
                              </div>
                            )}

                            {currentPage < totalAPages - 4 && (
                              <button
                                onClick={() => setCurrentPage(totalAPages)}
                                className={`px-4 mx-2  my-2 py-2 rounded-md text-sm font-medium
                                              bg-white text-gray-700 hover:bg-gray-100'
                                            } shadow-lg transition duration-300 transform`}
                              >
                                Last Page
                              </button>
                            )}
                            {/* Next Button */}
                            <div>
                              <button
                                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                                  currentPage === totalAPages
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                } shadow-lg transition duration-300 transform`}
                              >
                                Next
                                <ChevronRight className="h-5 w-5 ml-2" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      {isDetailModalOpen && (
        <DetailsModal
          isOpen={isDetailModalOpen}
          onClose={handleJobModalClose}
          type={currentDetailType}
          data={currentDetail as Job | Application}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default DashboardPage;
