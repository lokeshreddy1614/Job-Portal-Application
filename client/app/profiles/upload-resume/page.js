"use client"

import { uploadResume } from '@/app/utils/profile'
import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as pdfjs from 'pdfjs-dist'
import 'pdfjs-dist/build/pdf.worker.mjs'
import "../../styles/uploadResume.css"
import DataContext from '@/app/context/DataContext'
import useAuthCheck from '@/app/hooks/useAuthCheck'
import Image from 'next/image'

const Page = () => {

    const { isAuthenticated, loading } = useAuthCheck()

    const [file, setFile] = useState(null)
    const [pdfPreviews, setPdfPreviews] = useState([])
    const router = useRouter()

    const { userData, setUserData } = useContext(DataContext)

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0]

        if (!selectedFile) return

        // Check if file is a PDF
        if (selectedFile.type !== "application/pdf") {
            alert("Only PDF files are allowed.")
            return
        }

        setFile(selectedFile)
        generatePdfPreviews(selectedFile)
    }

    const generatePdfPreviews = async (pdfFile) => {
        const fileReader = new FileReader()
        fileReader.readAsArrayBuffer(pdfFile)
        fileReader.onload = async () => {
            const loadingTask = pdfjs.getDocument(fileReader.result)
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

                const renderContext = { canvasContext: context, viewport }
                await page.render(renderContext).promise

                pageImages.push(canvas.toDataURL("image/png"))
            }

            setPdfPreviews(pageImages)
        }
    }

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file before uploading.")
            return
        }
        try {
            const response = await uploadResume(file)
            setUserData(response.user)
            router.push(`/profiles/${userData._id}`)
        } catch (error) {
            console.error("Upload failed:", error)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
            {/* Resume Upload Section */}
            {isAuthenticated && (
                <div className="p-6 bg-gray-900 rounded-lg shadow-md w-full max-w-md space-y-4">
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="w-full border p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* PDF Previews with Custom Scrollbar */}
                    {pdfPreviews.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-400 mb-2">PDF Preview:</p>
                            <div className="max-h-96 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700 scrollbar-thumb-rounded">
                                {pdfPreviews.map((preview, index) => (
                                    <Image
                                        key={index}
                                        src={preview}
                                        alt={`Page ${index + 1}`}
                                        width={500}
                                        height={800}
                                        className="rounded shadow-md"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!file}
                        className={`w-full text-white py-2 rounded transition ${file ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-500 cursor-not-allowed"}`}
                    >
                        Upload Resume
                    </button>
                </div>
            )}
        </div>
    )
}

export default Page
