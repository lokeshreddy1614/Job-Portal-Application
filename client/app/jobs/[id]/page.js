"use client"

import { useContext, useEffect, useState } from "react"
import { deleteJob, getJobById } from "@/app/utils/jobs"
import { useParams, useRouter } from "next/navigation"
import DataContext from "@/app/context/DataContext"
import { toast } from "react-toastify"
import { applyForJob } from "@/app/utils/applications"
import Loading from "@/app/components/Loading"

const JobByIdPage = () => {
    const [job, setJob] = useState(null)
    const [processing, setProcessing] = useState(false)
    const { id } = useParams()
    const router = useRouter()
    const { userData, setIsLogin, isLoading, setIsLoading } = useContext(DataContext)

    useEffect(() => {
        if (userData) {
            setIsLogin(true)
        }
        if (!id) return
        const fetchJob = async () => {
            setIsLoading(true)
            try {
                const response = await getJobById(id)
                setJob(response.job)
            } catch (error) {
                console.error("Error fetching job:", error)
                toast.error("Failed to fetch job details")
            } finally {
                setIsLoading(false)
            }
        }
        fetchJob()
    }, [userData, id])

    const handleApply = async (id) => {
        if (processing) return
        setProcessing(true)
        try {
            const response = await applyForJob(id)
            toast.success(response.message)
        } catch (error) {
            toast.error(error.message || "Failed to apply")
        } finally {
            setProcessing(false)
        }
    }

    const handleDelete = async (id) => {
        if (processing) return
        setProcessing(true)
        try {
            const response = await deleteJob(id)
            toast.success(response.message)
            router.push("/jobs")
        } catch (error) {
            toast.error("Failed to delete job")
        } finally {
            setProcessing(false)
        }
    }

    if (isLoading) {
        return (<Loading />)
    }

    if (!job) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <p className="text-red-400 text-lg font-semibold">Job not found</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
                <h1 className="text-3xl font-bold text-white mb-4">
                    {job.title}
                </h1>
                <div className="mt-4 flex items-center space-x-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                        {job.jobType}
                    </span>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">
                        {job.experience} years
                    </span>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm">
                        {job.location}
                    </span>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">
                        Description
                    </h2>
                    <p className="text-gray-400">
                        As a <b>{job.title?.split(' (')[0]}</b>, you will:
                    </p>
                    <ul className="text-gray-400 space-y-2">
                        {job.description.map((point, index) => (
                            <li key={index} className="text-justify">{point}</li>
                        ))}
                    </ul>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">
                        Qualifications
                    </h2>
                    <ul className="text-gray-400 space-y-2">
                        {job.qualifications.map((point, index) => (
                            <li
                                key={index}
                                className="text-justify"
                            >
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-8 flex justify-end gap-x-5">
                    <button
                        onClick={() =>
                            ["Admin", "HR", "Manager"].includes(userData?.role)
                                ? router.push(`/jobs/update/${job._id}`)
                                : handleApply(job._id)
                        }
                        className={`px-8 py-3 rounded-lg transition ${processing ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            } text-white`}
                        disabled={processing}
                    >
                        {["Admin", "HR", "Manager"].includes(userData?.role) ? "Edit" : "Apply Now"}
                    </button>

                    {["Admin", "HR", "Manager"].includes(userData?.role) && (
                        <button
                            onClick={() => handleDelete(job._id)}
                            className={`px-8 py-3 rounded-lg transition ${processing ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                                } text-white`}
                            disabled={processing}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default JobByIdPage
