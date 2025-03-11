"use client"

import Loading from "@/app/components/Loading"
import DataContext from "@/app/context/DataContext"
import useAuthCheck from "@/app/hooks/useAuthCheck"
import { getProfileById, updateProfile } from "@/app/utils/profile"
import { useRouter } from "next/navigation"
import { useState, useEffect, useContext } from "react"
import { toast } from "react-toastify"

const Page = () => {

    const { isAuthenticated, loading } = useAuthCheck()

    const { userData, setUserData, setIsLogin } = useContext(DataContext)

    const [skills, setSkills] = useState([])
    const [experience, setExperience] = useState("")
    const [education, setEducation] = useState("")
    const [location, setLocation] = useState("")
    const [addSkill, setAddSkill] = useState("")
    const [touched, setTouched] = useState({
        skills: false,
        experience: false,
        education: false,
        location: false,
    })

    useEffect(() => {
        if (userData?.profileId) {
            setSkills(userData?.profileId?.skills || [])
            setExperience(userData?.profileId?.experience || "")
            setEducation(userData?.profileId?.education || "")
            setLocation(userData?.profileId?.location || "")
        }
    }, [userData])


    const handleAddSkills = () => {
        const newSkill = addSkill.trim().toLowerCase()
        if (newSkill && !skills.includes(newSkill)) {
            setSkills((prev) => [...prev, newSkill])
            setAddSkill("")
            setTouched((prev) => ({ ...prev, skills: false }))
        }
    }

    const handleRemoveSkill = (index) => {
        setSkills((prev) => prev.filter((_, i) => i !== index))
        setTouched((prev) => ({ ...prev, skills: true }))
    }

    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setTouched({ skills: true, experience: true, education: true, location: true })

        if (!experience || !education || !location || skills.length === 0) return

        try {
            const response = await updateProfile({ skills, experience, education, location })
            setUserData(response.user)
            toast.success(response.message)
            router.push(`/profiles/${userData._id}`)

            if (response.success) {
                setSkills([])
                setExperience("")
                setEducation("")
                setLocation("")
                setAddSkill("")
                setTouched({ skills: false, experience: false, education: false, location: false })
            }
        } catch (error) {
            console.error("Update failed:", error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            setIsLogin(true)
            const fetchProfile = async () => {
                const response = await getProfileById(userData?._id)
                setUserData(response.user)
            }
            fetchProfile()
        }
    }, [isAuthenticated])

    if(loading) {
        return (<Loading />)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            {isAuthenticated && (
                <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto p-6 border rounded-lg shadow-lg bg-gray-800 space-y-6">

                    <h1 className="text-3xl font-bold text-center mb-6">Update Profile</h1>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-300 mb-1">Skills</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                className={`flex-grow p-2 border rounded focus:outline-none focus:ring-2 ${touched.skills && skills.length === 0 ? "border-red-500" : "focus:ring-blue-500"
                                    }`}
                                type="text"
                                placeholder="Enter a skill"
                                value={addSkill}
                                onChange={(e) => setAddSkill(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkills())}
                                onBlur={() => setTouched((prev) => ({ ...prev, skills: true }))}
                            />
                            <button
                                type="button"
                                onClick={handleAddSkills}
                                className="sm:w-auto w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            >
                                Add
                            </button>
                        </div>
                        {touched.skills && skills.length === 0 && <span className="text-red-500 text-xs mt-1">Required</span>}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {skills.length ? (
                            skills.map((skill, index) => (
                                <div key={index} className="flex items-center bg-gray-700 px-3 py-1 rounded-full text-sm">
                                    <span>{skill}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(index)}
                                        className="ml-2 px-2 py-0.5 text-red-500 hover:text-red-700"
                                    >
                                        ❌
                                    </button>
                                </div>
                            ))
                        ) : (
                            <span className="text-gray-500">No skills added</span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-300 mb-1">Experience (years)</label>
                        <select
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            onBlur={() => setTouched((prev) => ({ ...prev, experience: true }))}
                            className={`w-full p-2 border rounded text-sm focus:outline-none bg-gray-700 text-gray-200 ${touched.experience && !experience ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
                                }`}
                        >
                            <option value="">Select</option>
                            {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "10+"].map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        {touched.experience && !experience && <span className="text-red-500 text-xs mt-1">Required</span>}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-300 mb-1">Education</label>
                        <input
                            className={`w-full p-2 border rounded text-sm focus:outline-none ${touched.education && !education ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
                                }`}
                            type="text"
                            placeholder="Enter your education"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            onBlur={() => setTouched((prev) => ({ ...prev, education: true }))}
                        />
                        {touched.education && !education && <span className="text-red-500 text-xs mt-1">Required</span>}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-300 mb-1">Location</label>
                        <input
                            className={`w-full p-2 border rounded text-sm focus:outline-none ${touched.location && !location ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
                                }`}
                            type="text"
                            placeholder="Enter your location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onBlur={() => setTouched((prev) => ({ ...prev, location: true }))}
                        />
                    </div>

                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
                        Update Profile
                    </button>
                </form>
            )}
        </div>
    )
}

export default Page
