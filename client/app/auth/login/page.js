"use client"

import DataContext from "@/app/context/DataContext"
import { login } from "@/app/utils/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { toast } from "react-toastify"

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const { setUserData, setIsLogin, setIsLoading, isLoading } = useContext(DataContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await login({ email, password })
            localStorage.setItem("userData", JSON.stringify(response.user))
            setUserData(response.user)
            console.log(response.user)
            setIsLogin(true)
            router.push("/")
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
            <div className="bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-semibold text-white mb-6 text-center">
                    Login
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col space-y-4"
                >
                    <input
                        className="border border-gray-600 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="border border-gray-600 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link
                        href="/auth/forgot-password"
                        className="text-sm text-blue-400 hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>
                <div className="mt-2 text-center text-sm text-gray-300">
                    {"Don't have an account?"}{" "}
                    <Link
                        href="/auth/signup"
                        className="text-blue-400 hover:underline"
                    >
                        Signup
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
