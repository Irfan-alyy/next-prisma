"use client"

import { FilterIcon } from "lucide-react"
import {motion} from "framer-motion"
import { useState } from "react"

const FilterModal=({search}:{search:(query:string)=>void})=>{
const [showModal,setShowModal]=useState<boolean>(false)
const [filter,setFilter]=useState({
    salaryRange:"",
    jobType:"",
    location:"",
    salaryGt:""

})
    return(
        <motion.div>
            <FilterIcon/>

            { showModal &&<motion.div className="absolute inset-0 w-100 h-100 bg-green">
                    <div>
                        <form action="">
                            <fieldset className="flex flex-col gap-2">
                                <label htmlFor="range">Salary Range</label>
                                <input type="range" name="salaryRange" min={0} max={200}/>
                            </fieldset>
                            <fieldset className="flex flex-col gap-2">
                                <label htmlFor="range" >Salary Greater Than</label>
                                <input type="text" name="salaryGt"/>
                            </fieldset>
                            <fieldset className="flex flex-col gap-2">
                                <label htmlFor="location">Location</label>
                                <input type="range" name="location"/>
                            </fieldset>
                            <fieldset className="flex flex-col gap-2">
                                <label htmlFor="job">Job Type</label>
                                <select name="jobType" id="job">
                                    <option selected={true} value="fullTime">Full Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="remote">Remote</option>
                                </select>
                            </fieldset>
                            <button>Apply filters</button>
                        </form>
                    </div>
                </motion.div>}
        </motion.div>
    )

}
export default FilterModal