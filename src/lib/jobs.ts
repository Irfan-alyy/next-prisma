import { Job} from "@/lib/types"
import prisma from "./prisma"
import { JobSearchParams } from "@/app/jobs/page"
export async function getJobs(params:JobSearchParams, currentPage:number,jobsPerPage:number){
    let jobs:Array<Job>=[]
    let totalJobs:number=0
    console.log(params);
    
    try {
        let where = {}
        if (params?.search) {
          where =
          {
            OR: [
              { title: { contains: params?.search.toString(), mode: 'insensitive' } },
              { company: { contains: params?.search.toString(), mode: 'insensitive' } },
              { contract: { contains: params?.search.toString(), mode: 'insensitive' } },
              { location: { contains: params?.search.toString(), mode: 'insensitive' } },
            ],
            salary:{
              gt:params?.salaryMin?.toString(),
              ls:params?.salaryMax?.toString()
            }
          }
        }
        // console.log(where,"where");
        jobs = await prisma.job.findMany({
          where,
          orderBy: { postedAt: "desc" },
          include: { postedBy: true },
          skip: (currentPage - 1) * jobsPerPage,
          take: jobsPerPage
        })
        totalJobs = await prisma.job.count({ where })
        // console.log(filteredJobs);
      } catch (error:unknown) {
        console.log("Error Occured during fetching jobs", error?.message)
      }
      return {jobs,totalJobs}
}