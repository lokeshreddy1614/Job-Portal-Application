"use client"

import Loading from "@/app/components/Loading"
import DataContext from "@/app/context/DataContext"
import useAuthCheck from "@/app/hooks/useAuthCheck"
import { addProfile } from "@/app/utils/profile"
import { useRouter } from "next/navigation"
import { useState, useContext, useEffect } from "react"
import { toast } from "react-toastify"

const AddProfilePage = () => {

    const { isAuthenticated, loading } = useAuthCheck()

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

    const [showModal, setShowModal] = useState(false)
    const { userData, setUserData, setIsLogin } = useContext(DataContext)

    useEffect(() => {
        if (isAuthenticated) {
            setIsLogin(true)
        }
    }, [isAuthenticated])

    const handleAddSkills = () => {
        if (addSkill.trim() && !skills.includes(addSkill)) {
            setSkills((prevSkills) => [...prevSkills, addSkill])
            setAddSkill("")
            setTouched((prev) => ({ ...prev, skills: false }))
        }
    }

    const handleRemoveSkill = (index) => {
        setSkills((prevSkills) => prevSkills.filter((_, i) => i !== index))
        if (skills.length === 1) {
            setTouched((prev) => ({ ...prev, skills: true }))
        }
    }

    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setTouched({ skills: true, experience: true, education: true, location: true })

        if (!experience || !education || !location || skills.length === 0) {
            return
        }

        try {
            const response = await addProfile({ skills, experience, education, location })
            setUserData(response.user)
            toast.success(response.message)
            setShowModal(true)
            setAddSkill("")
            setEducation("")
            setExperience("")
            setLocation("")
            setSkills([])
            setTouched({ skills: false, experience: false, education: false, location: false })
            if (userData?.role !== "User") {
                router.push(`/profiles/${userData?._id}`)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const handleModalClose = () => {
        setShowModal(false)
        router.push("/profiles/upload-resume")
    }

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
                        <label className="text-sm font-medium text-gray-300 mb-1">Skills</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                className={`flex-grow p-3 border rounded focus:outline-none focus:ring-2 ${touched.skills && skills.length === 0
                                    ? "border-red-500"
                                    : "focus:ring-blue-500"
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
                                className="sm:w-auto w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                            >
                                Add
                            </button>
                        </div>
                        {touched.skills && skills.length === 0 && <span className="text-red-500 text-xs mt-1">Required</span>}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {skills.length !== 0 ? (
                            skills.map((skill, index) => (
                                <div key={index} className="flex items-center bg-blue-700 px-3 py-1 rounded-full text-sm text-white">
                                    <span>{skill}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(index)}
                                        className="ml-2 px-2 py-0.5 cursor-pointer text-red-400 hover:text-red-600"
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
                            onChange={(e) => {
                                setExperience(e.target.value)
                                setTouched((prev) => ({ ...prev, experience: false }))
                            }}
                            onBlur={() => setTouched((prev) => ({ ...prev, experience: true }))}
                            className={`w-full p-3 border rounded text-sm focus:outline-none bg-gray-700 text-gray-200 ${touched.experience && !experience ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
                                }`}
                        >
                            <option className="w-[80%]" value="">Select</option>
                            {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "10+"].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                        {touched.experience && !experience && <span className="text-red-500 text-xs mt-1">Required</span>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-300 mb-1">Education</label>
                        <input
                            className={`w-full p-3 border rounded text-sm focus:outline-none ${touched.education && !education ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
                                }`}
                            type="text"
                            placeholder="Enter your education"
                            value={education}
                            onChange={(e) => {
                                setEducation(e.target.value)
                                setTouched((prev) => ({ ...prev, education: false }))
                            }}
                            onBlur={() => setTouched((prev) => ({ ...prev, education: true }))}
                        />
                        {touched.education && !education && <span className="text-red-500 text-xs mt-1">Required</span>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-300 mb-1">Location</label>
                        <input
                            className={`w-full p-3 border rounded text-sm focus:outline-none ${touched.location && !location ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
                                }`}
                            type="text"
                            placeholder="Enter your location"
                            value={location}
                            onChange={(e) => {
                                setLocation(e.target.value)
                                setTouched((prev) => ({ ...prev, location: false }))
                            }}
                            onBlur={() => setTouched((prev) => ({ ...prev, location: true }))}
                        />
                        {touched.location && !location && <span className="text-red-500 text-xs mt-1">Required</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                    >
                        Create Profile
                    </button>
                </form>
            )}
            {showModal && userData.role === "User" ? (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
                        <h2 className="text-lg font-semibold mb-4 text-white">Upload Resume Now?</h2>
                        <p className="text-gray-400 mb-4">
                            Would you like to upload your resume now or later?
                        </p>
                        <div className="flex justify-between">
                            <button
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                                onClick={handleModalClose}
                            >
                                Later
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                onClick={handleModalClose}
                            >
                                Upload Now
                            </button>
                        </div>
                    </div>
                </div>
            ) : (null)}
        </div>
    )
}

export default AddProfilePage
