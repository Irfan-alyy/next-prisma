import {User, Job} from "@/lib/types"
import prisma from "./prisma"
export async function getJobs(search:string, currentPage:number,jobsPerPage:number){
    let jobs:Array<Job>=[]
    let totalJobs:number=0
    try {
        let where = {}
        if (search) {
          where =
          {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { company: { contains: search, mode: 'insensitive' } },
              { contract: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } },
            ]
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