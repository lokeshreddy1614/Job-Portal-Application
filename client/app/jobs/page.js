"use client"

import { useContext, useEffect, useState } from "react"
import { getJobs } from "../utils/jobs"
import DataContext from "../context/DataContext"
import { useRouter } from "next/navigation"
import Loading from "../components/Loading"

const Page = () => {
    const [jobs, setJobs] = useState([])

    const { isLoading, setIsLoading, userData, setIsLogin } = useContext(DataContext)

    const router = useRouter()

    const fetchJobs = async () => {
        try {
            setIsLoading(true)
            const response = await getJobs()
            setJobs(response.jobs)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (userData) {
            setIsLogin(true)
        }
        fetchJobs()
    }, [userData])

    if (isLoading) {
        return (<Loading />)
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Job Listings</h1>
            <div className="max-w-4xl mx-auto grid gap-6">
                {jobs.length > 0 ? (
                    jobs.map((job, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg"
                        >
                            <h2 className="text-2xl font-semibold text-gray-100">{job.title}</h2>
                            <p className="text-gray-300 mt-2">
                                {job.description[0]}
                            </p>
                            <div className="mt-4 flex items-center space-x-4">
                                <span className="bg-blue-700 text-white px-3 py-1 rounded-[5px] text-sm">
                                    {job.jobType}
                                </span>
                                <span className="bg-blue-700 text-white px-3 py-1 rounded-[5px] text-sm">
                                    {job.experience} years
                                </span>
                                <span className="bg-blue-700 text-white px-3 py-1 rounded-[5px] text-sm">
                                    {job.location}
                                </span>
                            </div>
                            <div className="text-right mt-4">
                                <button
                                    onClick={() => router.push(`/jobs/${job._id}`)}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    {userData?.role === "Admin" ||
                                        userData?.role === "HR" ||
                                        userData?.role === "Manager"
                                        ? "View"
                                        : "Apply Now"}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No jobs available.</p>
                )}
            </div>
        </div>
    )
}

export default Page
