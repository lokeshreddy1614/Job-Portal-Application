"use client"

import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getApplication } from "@/app/utils/applications"
import DataContext from "@/app/context/DataContext"
import useAuthCheck from "@/app/hooks/useAuthCheck"
import Loading from "@/app/components/Loading"

const UserApplicationsPage = () => {

    const { isAuthenticated, loading } = useAuthCheck()

    const [applications, setApplications] = useState([])
    const router = useRouter()

    const { setUserData, setIsLogin } = useContext(DataContext)

    const fetchApplications = async () => {
        try {
            const response = await getApplication()
            setUserData(response.user)
            setIsLogin(true)
            setApplications(response.applications)
        } catch (error) {
            console.error("Error fetching applications:", error)
        }
    }

    useEffect(() => {
        fetchApplications()
        console.log("Error")
    }, [])

    if (loading) {
        return (<Loading />)
    }

    return (
        <>
            {isAuthenticated && (
                <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-900 min-h-screen flex flex-col items-center text-gray-200">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 sm:mb-8 border-b-4 border-blue-500 pb-2 text-center">
                        Job Applications
                    </h1>
                    {applications.length > 0 ? (
                        <div className="w-full space-y-4 sm:space-y-6">
                            {applications.map((application) => (
                                <div
                                    onClick={() => router.push(`../jobs/${application.jobId._id}`)}
                                    key={application._id}
                                    className="bg-gray-800 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl p-4 sm:p-6 transition transform hover:scale-105 hover:shadow-xl cursor-pointer border-l-4 border-blue-500 hover:border-blue-400"
                                >
                                    <h2 className="text-lg sm:text-2xl font-semibold text-white">
                                        {application.jobId.title}
                                    </h2>
                                    <p className="text-gray-400 text-sm sm:text-base mt-1">
                                        {application.jobId.jobType} | {application.jobId.location}
                                    </p>
                                    <p className="text-gray-400 text-sm sm:text-base">
                                        Experience: {application.jobId.experience} years
                                    </p>
                                    <p className={
                                        `font-medium ${application.status === "Selected" ?
                                            "text-green-400" : application.status === "Rejected" ?
                                                "text-red-400" : "text-blue-400"
                                        }`}
                                    >
                                        {application.status}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 text-sm sm:text-lg">
                            No applications found.
                        </p>
                    )}
                </div>
            )}
        </>
    )
}

export default UserApplicationsPage
