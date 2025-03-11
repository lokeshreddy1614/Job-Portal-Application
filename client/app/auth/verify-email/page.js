"use client"

import Loading from "@/app/components/Loading"
import { verifyEmail } from "@/app/utils/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { toast } from "react-toastify"

const VerifyEmailPage = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const [message, setMessage] = useState("Verifying...")
    const router = useRouter()

    const verify = async () => {
        try {
            const response = await verifyEmail(token)
            setMessage("Email verified! Redirecting to home page...")
            toast.success(response.message)
            setTimeout(() => {
                router.push("/")
            }, 5000)
        } catch (error) {
            console.error(error)
            setMessage("Verification failed. Please try again.")
            toast.error(error.message)
        }
    }

    useEffect(() => {
        verify()
        console.log("Error")
    }, [])

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
            <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-xl max-w-md text-center">
                <h2 className="text-2xl font-semibold">Email Verification</h2>
                <p className="text-gray-400 mt-2">{message}</p>
            </div>
        </div>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <VerifyEmailPage />
        </Suspense>
    )
}
