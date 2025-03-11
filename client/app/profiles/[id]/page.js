"use client"

import { getProfileById } from "@/app/utils/profile"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import * as pdfjs from "pdfjs-dist"
import "pdfjs-dist/build/pdf.worker.mjs"
import "../../styles/uploadResume.css"
import DataContext from "@/app/context/DataContext"
import useAuthCheck from "@/app/hooks/useAuthCheck"
import Image from "next/image"
import { API_URL } from "@/app/utils/api"

const ProfileDetailsPage = () => {

    const { isAuthenticated, loading } = useAuthCheck()

    const [profile, setProfile] = useState(null)
    const [pdfPreviews, setPdfPreviews] = useState([])
    const { id } = useParams()

    const { userData, setUserData, setIsLogin } = useContext(DataContext)

    const fetchProfile = async () => {
        const response = await getProfileById(id)
        setUserData(response.user)
        setProfile(response.candidate)
        setIsLogin(true)

        if (response.candidate?.resume) {
            generatePdfPreviews(`${API_URL}${response.candidate.resume}`)
        }
    }

    const generatePdfPreviews = async (pdfUrl) => {
        try {
            const loadingTask = pdfjs.getDocument(pdfUrl)
            const pdf = await loadingTask.promise
            const pageImages = []

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum)
                const scale = 1.5
                const viewport = page.getViewport({ scale })
                const canvas = document.createElement("canvas")
                const context = canvas.getContext("2d")

                canvas.width = viewport.width
                canvas.height = viewport.height

                await page.render({ canvasContext: context, viewport }).promise
                pageImages.push(canvas.toDataURL("image/png"))
            }

            setPdfPreviews(pageImages)
        } catch (error) {
            console.error("Error generating PDF preview:", error)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile()
            console.log("Error")
        }
    }, [isAuthenticated])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>
    }

    return (
        <div className="min-h-screen flex justify-center bg-gray-900 px-4 py-10">
            {isAuthenticated && (
                <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-xl shadow-xl relative">
                    {userData?._id === profile?.userId?._id && (
                        <div className="flex justify-end mb-4">
                            <Link href={"/profiles/update"}>
                                <button className="bg-blue-600 text-white px-4 py-1 text-sm rounded-md hover:bg-blue-700 transition">Edit</button>
                            </Link>
                        </div>
                    )}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-100">{profile?.userId?.name}</h2>
                    </div>
                    <div className="mt-6 space-y-4 text-gray-300">
                        <p><span className="font-semibold">Email:</span> {profile?.userId?.email}</p>
                        <p><span className="font-semibold">Education:</span> {profile?.education}</p>
                        <p><span className="font-semibold">Experience:</span> {profile?.experience} years</p>
                        <p><span className="font-semibold">Location:</span> {profile?.location}</p>
                    </div>
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-100">Skills</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {profile?.skills?.map((skill, index) => (
                                <span key={index} className="px-4 py-1 bg-blue-700 text-white text-sm rounded-full shadow-md">{skill}</span>
                            ))}
                        </div>
                    </div>

                    {!profile?.resume && (
                        <div className="mt-3 flex justify-between items-center">
                            {userData?.role === "User" && (
                                <Link href={"/profiles/upload-resume"} className="text-blue-400 hover:text-blue-500 underline">
                                    Upload Resume
                                </Link>
                            )}
                        </div>
                    )
                    }

                    {profile?.resume && (
                        <div className="mt-8">
                            <h4 className="text-lg font-semibold text-gray-100 mb-2">Resume</h4>
                            <div className="border rounded-lg overflow-hidden p-4 bg-gray-700 shadow-sm">
                                <div className="max-h-96 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-500 scrollbar-thumb-rounded">
                                    {pdfPreviews.map((preview, index) => (
                                        <Image
                                            key={index}
                                            src={preview}
                                            alt={`Page ${index + 1}`}
                                            width={1200}
                                            height={800}
                                            className="rounded shadow-md"
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                                {userData?.role === "User" && (
                                    <Link href={"/profiles/upload-resume"} className="text-blue-400 hover:text-blue-500 underline">
                                        Update Resume
                                    </Link>
                                )}
                                <a href={`${API_URL}/${profile.resume}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500 underline">
                                    Download Resume
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProfileDetailsPage
