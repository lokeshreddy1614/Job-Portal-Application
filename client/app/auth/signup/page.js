"use client"

import DataContext from "@/app/context/DataContext"
import { signup } from "@/app/utils/auth"
import Link from "next/link"
import { useContext, useState } from "react"
import { toast } from "react-toastify"

const SignupPage = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSignedUp, setIsSignedUp] = useState(false)

    const { isLoading, setIsLoading } = useContext(DataContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await signup({ name, role: "User", email, password })
            setIsSignedUp(true)
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
            <div className="bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-md">
                {isSignedUp ? (
                    <div className="text-center text-green-400 font-medium">
                        Account verification link has been sent to your email.
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold text-white text-center mb-4">
                            Create an Account
                        </h2>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            <input
                                className="border border-gray-600 bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <input
                                className="border border-gray-600 bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                className="border border-gray-600 bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full text-white font-semibold p-3 rounded-lg transition ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {isLoading ? "Signing up..." : "Sign Up"}
                            </button>
                        </form>
                        <p className="text-center text-sm text-gray-400 mt-4">
                            Already have an account?{" "}
                            <Link
                                className="text-blue-400 hover:underline"
                                href="/auth/login"
                            >
                                Login
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default SignupPage
