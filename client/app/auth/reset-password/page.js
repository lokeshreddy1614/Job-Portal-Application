"use client"

import Loading from "@/app/components/Loading"
import DataContext from "@/app/context/DataContext"
import { resetPassword } from "@/app/utils/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useContext, useState } from "react"
import { toast } from "react-toastify"

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState("")
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const router = useRouter()

    const { setIsLoading } = useContext(DataContext)
    const [isButtonLoading, setIsButtonLoading] = useState(false)
    const [isResponse, setIsResponse] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setIsButtonLoading(true)
        try {
            const response = await resetPassword(token, newPassword)
            toast.success(response.message)
            setIsResponse(true)
            setTimeout(() => {
                router.push("/")
            }, 3000)
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        } finally {
            setIsLoading(false)
            setIsButtonLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-center text-white">
                    Reset Password
                </h2>
                <p className="text-sm text-center text-gray-400 mb-4">
                    Enter your new password below
                </p>
                {!isResponse ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={isButtonLoading}
                            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-blue-600/70 transition duration-300"
                        >
                            {isButtonLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-4 bg-green-700 text-white rounded-lg">
                        <p className="font-medium">
                            You will be redirected to the home page in 3 seconds
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ResetPasswordRevisedPage() {
    return (
        <Suspense fallback={<Loading />}>
            <ResetPasswordPage />
        </Suspense>
    )
}
