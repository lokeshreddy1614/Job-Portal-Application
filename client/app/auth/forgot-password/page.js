"use client"

import DataContext from "@/app/context/DataContext"
import { forgotPassword } from "@/app/utils/auth"
import Link from "next/link"
import { useContext, useState } from "react"
import { toast } from "react-toastify"

const ForgotPasswordPage = () => {

    const [email, setEmail] = useState("")
    const { isLoading, setIsLoading } = useContext(DataContext)
    const [isResponse, setIsResponse] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await forgotPassword(email)
            toast.success(response.message)
            setIsResponse(true)
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-white">
                    Forgot Password
                </h2>
                <p className="text-sm text-center text-gray-400 mb-4">
                    Enter your email to receive a reset link
                </p>
                {!isResponse ? (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <input
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-blue-600/70 transition duration-200"
                        >
                            {isLoading ? "Processing..." : "Send Reset Link"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-4 bg-green-600/20 text-green-400 rounded-lg">
                        <p className="font-medium">
                            Please check your email for the password reset link!
                        </p>
                    </div>
                )}
                <div className="mt-4 text-center">
                    <Link
                        href="/auth/login"
                        className="text-blue-400 hover:underline"
                    >
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage
