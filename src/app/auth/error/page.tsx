"use client"
import LoadingSpinner from "@/components/spinners";
import { Suspense } from "react";
import ErrorPage from "./ErrorPage";

export default function Errorpage(){

  return(
        <Suspense fallback={<div><LoadingSpinner/></div>}>
          <ErrorPage/>
        </Suspense>
    
  )
}