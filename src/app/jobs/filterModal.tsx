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
        </motion.div>
    )

}
export default FilterModal