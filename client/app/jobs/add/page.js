"use client"

import Loading from "@/app/components/Loading"
import DataContext from "@/app/context/DataContext"
import useAuthCheck from "@/app/hooks/useAuthCheck"
import { createJob } from "@/app/utils/jobs"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

const AddJobPage = () => {

    const { isAuthenticated, loading } = useAuthCheck()

    const { userData, setUserData, setIsLogin } = useContext(DataContext)

    const router = useRouter()

    const [formData, setFormData] = useState({
        title: "",
        description: [],
        qualifications: [],
        location: "",
        experience: "",
        jobType: "Full-time",
        status: "Open",
    })

    const [touched, setTouched] = useState({
        title: false,
        description: false,
        qualifications: false,
        location: false,
        experience: false,
        jobType: false,
    })

    const [descriptionPoint, setDescriptionPoint] = useState("")
    const [qualificationPoint, setQualificationPoint] = useState("")

    const allowedRoles = ["Admin", "Manager", "HR"]
    if (isAuthenticated && !allowedRoles.includes(userData?.role)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <p className="text-red-500 text-lg font-semibold">
                    Access Denied: You do not have permission to create a job.
                </p>
            </div>
        )
    }

    const handleAddPoint = (type, value) => {
        if (value.trim()) {
            setFormData({
                ...formData,
                [type]: [...formData[type], value],
            })
            type === "description" ? setDescriptionPoint("") : setQualificationPoint("")
            setTouched((prev) => ({ ...prev, [type]: false }))
        }
    }

    const handleRemovePoint = (type, index) => {
        const updatedList = formData[type].filter((_, i) => i !== index)
        setFormData({ ...formData, [type]: updatedList })
        if (updatedList.length === 0) {
            setTouched((prev) => ({ ...prev, [type]: true }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setTouched({
            title: true,
            description: true,
            qualifications: true,
            location: true,
            experience: true,
            jobType: true,
        })

        if (
            !formData.title ||
            !formData.location ||
            !formData.experience ||
            formData.description.length === 0 ||
            formData.qualifications.length === 0
        ) {
            return
        }

        try {
            const response = await createJob(formData)
            router.push("/jobs")
            setUserData(response.user)
            toast.success(response.message)
            setFormData({
                title: "",
                description: [],
                qualifications: [],
                location: "",
                experience: "",
                jobType: "Full-time",
                status: "Open",
            })
            setTouched({
                title: false,
                description: false,
                qualifications: false,
                location: false,
                experience: false,
                jobType: false,
            })
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if(isAuthenticated) {
            setIsLogin(true)
        }
    }, [isAuthenticated])

    if (loading) {
        return (<Loading />)
    }

    return (
        <div className="flex items-center justify-center bg-gray-900 pb-10">
            {isAuthenticated && (
                <form
                    onSubmit={handleSubmit}
                    className="max-w-lg w-full mx-auto p-6 border rounded-lg shadow-lg bg-gray-800 space-y-6"
                >
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-300 mb-1">Job Title</label>
                        <input
                            className={`w-full p-2 border rounded text-sm focus:outline-none bg-gray-700 text-gray-200 ${touched.title && !formData.title ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
                                }`}
                            type="text"
                            placeholder="Enter job title"
                            value={formData.title}
                            onChange={(e) => {
                                setFormData({ ...formData, title: e.target.value })
                                setTouched((prev) => ({ ...prev, title: false }))
                            }}
                            onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
                        />
                        {touched.title && !formData.title && <span className="text-red-500 text-xs mt-1">Required</span>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-300 mb-1">Description</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                className={`flex-grow p-2 border rounded bg-gray-700 text-gray-200 focus:outline-none ${touched.description && formData.description.length === 0
                                    ? "border-red-500"
                                    : "focus:ring-2 focus:ring-blue-500"
                                    }`}
                                type="text"
                                placeholder="Enter a description point"
                                value={descriptionPoint}
                                onChange={(e) => setDescriptionPoint(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPoint("description", descriptionPoint))}
                                onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
                            />
                            <button
                                type="button"
                                onClick={() => handleAddPoint("description", descriptionPoint)}
                                className="sm:w-auto w-full cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Add
                            </button>
                        </div>
                        {touched.description && formData.description.length === 0 && (
                            <span className="text-red-500 text-xs mt-1">Required</span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {formData.description.length !== 0 ? (
                            formData.description.map((desc, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-600 px-3 py-1 rounded-[5px] text-sm text-gray-300">
                                    <span>{desc}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePoint("description", index)}
                                        className="ml-2 px-2 py-0.5 cursor-pointer text-red-500 hover:text-red-700"
                                    >
                                        ❌
                                    </button>
                                </div>
                            ))
                        ) : (
                            <span className="text-gray-500">No description points added</span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-300 mb-1">Qualifications</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                className={`flex-grow p-2 border rounded bg-gray-700 text-gray-200 focus:outline-none ${touched.qualifications && formData.qualifications.length === 0
                                    ? "border-red-500"
                                    : "focus:ring-2 focus:ring-blue-500"
                                    }`}
                                type="text"
                                placeholder="Enter a qualification"
                                value={qualificationPoint}
                                onChange={(e) => setQualificationPoint(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && (e.preventDefault(), handleAddPoint("qualifications", qualificationPoint))
                                }
                                onBlur={() => setTouched((prev) => ({ ...prev, qualifications: true }))}
                            />
                            <button
                                type="button"
                                onClick={() => handleAddPoint("qualifications", qualificationPoint)}
                                className="sm:w-auto w-full cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Add
                            </button>
                        </div>
                        {touched.qualifications && formData.qualifications.length === 0 && (
                            <span className="text-red-500 text-xs mt-1">Required</span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {formData.qualifications.length !== 0 ? (
                            formData.qualifications.map((qual, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-600 px-3 py-1 rounded-[5px] text-sm text-gray-300">
                                    <span>{qual}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePoint("qualifications", index)}
                                        className="ml-2 px-2 py-0.5 cursor-pointer text-red-500 hover:text-red-700"
                                    >
                                        ❌
                                    </button>
                                </div>
                            ))
                        ) : (
                            <span className="text-gray-500">No qualifications added</span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-300 mb-1">Location</label>
                        <input
                            className={`w-full p-2 border rounded text-sm focus:outline-none bg-gray-700 text-gray-200 ${touched.location && !formData.location ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
                                }`}
                            type="text"
                            placeholder="Enter job location"
                            value={formData.location}
                            onChange={(e) => {
                                setFormData({ ...formData, location: e.target.value })
                                setTouched((prev) => ({ ...prev, location: false }))
                            }}
                            onBlur={() => setTouched((prev) => ({ ...prev, location: true }))}
                        />
                        {touched.location && !formData.location && <span className="text-red-500 text-xs mt-1">Required</span>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-300 mb-1">Experience (years)</label>
                        <input
                            className={`w-full p-2 border rounded text-sm focus:outline-none bg-gray-700 text-gray-200 ${touched.experience && !formData.experience ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
                                }`}
                            type="text"
                            placeholder="Enter years of experience"
                            value={formData.experience}
                            onChange={(e) => {
                                setFormData({ ...formData, experience: e.target.value })
                                setTouched((prev) => ({ ...prev, experience: false }))
                            }}
                            onBlur={() => setTouched((prev) => ({ ...prev, experience: true }))}
                        />
                        {touched.experience && !formData.experience && <span className="text-red-500 text-xs mt-1">Required</span>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-300 mb-1">Job Type</label>
                        <select
                            value={formData.jobType}
                            onChange={(e) => {
                                setFormData({ ...formData, jobType: e.target.value })
                                setTouched((prev) => ({ ...prev, jobType: false }))
                            }}
                            onBlur={() => setTouched((prev) => ({ ...prev, jobType: true }))}
                            className={`w-full p-2 border rounded text-sm focus:outline-none bg-gray-700 text-gray-200 ${touched.jobType && !formData.jobType ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
                                }`}
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                        {touched.jobType && !formData.jobType && <span className="text-red-500 text-xs mt-1">Required</span>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 cursor-pointer text-white py-2 rounded hover:bg-green-700 transition"
                    >
                        Create Job
                    </button>
                </form>
            )}
        </div>
    )
}

export default AddJobPage
