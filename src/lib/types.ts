export interface User{
    id: string;
    name?:string;
    email:string;
    image?:string;
    createdAt: Date;
    udaptedAt:Date;
    jobs:Partial<Job>
}

export interface Job {
    id: string;
    title: string;
    description: string;
    salary: string;
    postedAt: string;
    company: string;
    location: string;
    contract: string;
    postedById: string;
    postedBy: Partial<User>
  }
  
export interface Application {
    id: string;
    description: string;
    appliedAt: string;
    status: string;
    jobId:string;
    userId: string;
    resume: string;
    job: Partial<Job>
    applicant:Partial<User>;
  }
