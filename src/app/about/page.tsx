'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Users, Briefcase, Heart } from 'lucide-react';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 120 } },
};

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-inter">

      <main>
        <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20 md:py-28 overflow-hidden rounded-b-lg shadow-xl">
          <div className="absolute inset-0 z-0 opacity-10">
            <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <circle cx="20" cy="20" r="15" fill="currentColor" className="text-indigo-400"></circle>
              <circle cx="80" cy="50" r="25" fill="currentColor" className="text-purple-400"></circle>
              <circle cx="50" cy="80" r="10" fill="currentColor" className="text-indigo-300"></circle>
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
            >
              About JobBoard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto"
            >
              Connecting talented candidates with innovative employers to build the future of work.
            </motion.p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                At JobBoard, we believe in empowering individuals and organizations by creating seamless connections between job seekers and employers. Our platform is designed to make job searching and hiring intuitive, efficient, and rewarding.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-xl shadow-lg p-6 text-center"
              >
                <motion.div variants={iconVariants}>
                  <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">For Candidates</h3>
                <p className="text-gray-600">
                  Discover opportunities that match your skills and aspirations. Apply with ease and track your progress.
                </p>
              </motion.div>

              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-xl shadow-lg p-6 text-center"
              >
                <motion.div variants={iconVariants}>
                  <Briefcase className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">For Employers</h3>
                <p className="text-gray-600">
                  Find top talent to grow your team. Post jobs, review applications, and hire with confidence.
                </p>
              </motion.div>

              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-xl shadow-lg p-6 text-center"
              >
                <motion.div variants={iconVariants}>
                  <Heart className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Values</h3>
                <p className="text-gray-600">
                  Integrity, innovation, and inclusivity drive us to create a platform that serves everyone.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
