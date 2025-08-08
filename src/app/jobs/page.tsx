import Link from 'next/link';
import { Search, Briefcase, MapPin, DollarSign } from 'lucide-react'; // Importing icons from lucide-react// Importing framer-motion for animations
import prisma from '@/lib/prisma';


// Animation variants for job cards
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const JobsPage = async ({ searchParams }: { searchParams: Promise<{ search: string }> }) => {
  // Filter jobs based on search query (simplified for demo)
  let filteredJobs = []
  try {
    const { search } = await searchParams;
    const query = search as string
    let where={}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }
    filteredJobs = await prisma.job.findMany({
      where,
      orderBy:{postedAt:"desc"},
      include:{postedBy:true}
    })
  console.log(filteredJobs);
  } catch (error) {
  console.log("Error Occured during fetching jobs", error)
}

return (
  <div className="min-h-screen bg-gray-50 font-inter">
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20 md:py-28 overflow-hidden rounded-b-lg shadow-xl">
        <div className="absolute inset-0 z-0 opacity-10">
          {/* Background pattern - matching homepage circles */}
          <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <circle cx="20" cy="20" r="15" fill="currentColor" className="text-indigo-400"></circle>
            <circle cx="80" cy="50" r="25" fill="currentColor" className="text-purple-400"></circle>
            <circle cx="50" cy="80" r="10" fill="currentColor" className="text-indigo-300"></circle>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            Explore Job Opportunities
          </h1>
          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Find the perfect job that matches your skills and career goals.
          </p>
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <form className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search jobs by title, company, or location..."
                className="w-full pl-10 pr-4 py-3 rounded-md shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <button type='submit'>
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-12 text-center">
            Available Jobs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="flex justify-center mb-4">
                    <Briefcase className="h-12 w-12 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.company}</p>
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-4">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span>{job.salary}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{job.contract}</p>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition duration-300 transform hover:scale-105"
                  >
                    View Details
                    <svg
                      className="ml-2 -mr-1 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">No jobs found matching your search.</p>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-600 py-16 text-white rounded-t-lg shadow-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
            Can't Find the Right Job?
          </h2>
          <p className="text-lg sm:text-xl mb-10 opacity-90">
            Sign up to get personalized job recommendations and alerts.
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
    </main>

    {/* Footer */}
    {/* <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} JobBoard. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer> */}
  </div>
);
};

export default JobsPage;