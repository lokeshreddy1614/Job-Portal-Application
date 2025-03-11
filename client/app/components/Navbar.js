"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useContext } from "react"
import { useRouter } from "next/navigation"
import { logout } from "../utils/auth"
import DataContext from "../context/DataContext"
import { FaBars, FaUser, FaTimes } from "react-icons/fa"

const Navbar = () => {
    const { userData, setUserData, isLogin, setIsLogin, setIsLoading } = useContext(DataContext)
    const router = useRouter()
    const [isUserIconOpen, setIsUserIconOpen] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const sidebarRef = useRef(null)
    const profileRef = useRef(null)

    const handleLogout = async () => {
        setIsLoading(true)
        await logout()
        localStorage.removeItem("userData")
        setIsLoading(false)
        router.push("/")
        setIsLogin(false)
        setUserData(null)
        setIsSidebarOpen(false)
    }

    const handleOutsideClick = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsSidebarOpen(false)
        }
        if (profileRef.current && !profileRef.current.contains(event.target)) {
            setIsUserIconOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick)
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [])

    return (
        <header className="h-[12vh] flex items-center justify-between px-6 bg-gray-900 text-white shadow-md relative">
            {/* Mobile Sidebar Button */}
            <button className="md:hidden text-2xl" onClick={() => setIsSidebarOpen(true)}>
                <FaBars />
            </button>

            {/* App Heading */}
            <h1 onClick={() => router.push("/")} className="text-2xl font-bold md:mx-auto md:ml-0 cursor-pointer">
                Job Portal
            </h1>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-x-6 items-center">
                <Link href="/jobs" className="hover:text-blue-400 transition">
                    Jobs
                </Link>
                {!isLogin ? (
                    <Link href="/auth/login" className="border border-gray-400 px-4 py-1 rounded-full hover:bg-gray-700 transition">
                        Login
                    </Link>
                ) : (
                    <>
                        {userData?.role === "Admin" && (
                            <Link href="/dashboard/admin" className="hover:text-blue-400 transition">Dashboard</Link>
                        )}
                        {userData?.role !== "User" && (
                            <Link href="/jobs/add" className="hover:text-blue-400 transition">Add Jobs</Link>
                        )}
                        {userData?.role !== "User" && (
                            <Link href="/profiles" className="hover:text-blue-400 transition">User Profiles</Link>
                        )}
                        <Link href={userData?.role === "User" ? "/applications/user" : "/applications"} className="hover:text-blue-400 transition">
                            Applications
                        </Link>

                        {/* Profile Icon */}
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => setIsUserIconOpen(!isUserIconOpen)} className="text-2xl hover:text-blue-400 transition">
                                <FaUser />
                            </button>
                            {isUserIconOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-gray-800 text-white border border-gray-700 rounded shadow-md z-10">
                                    {userData?.profileId ? (
                                        <Link
                                            href={`/profiles/${userData._id}`}
                                            className="block px-4 py-2 hover:bg-gray-700 transition"
                                            onClick={() => setIsUserIconOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/profiles/add"
                                            className="block px-4 py-2 hover:bg-gray-700 transition"
                                            onClick={() => setIsUserIconOpen(false)}
                                        >
                                            Create Profile
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="block px-4 py-2 w-full text-left hover:bg-gray-700 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </nav>

            {/* Mobile Sidebar */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setIsSidebarOpen(false)}></div>}
            <aside
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 z-30`}
            >
                <div className="p-4 flex justify-between items-center border-b border-gray-700">
                    <h2 className="text-xl font-bold">Menu</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-2xl">
                        <FaTimes />
                    </button>
                </div>
                <nav className="flex flex-col gap-y-4 p-4">
                    <Link href="/jobs" className="hover:text-blue-400 transition" onClick={() => setIsSidebarOpen(false)}>
                        Jobs
                    </Link>
                    {!isLogin ? (
                        <Link href="/auth/login" className="border border-gray-400 px-4 py-2 rounded-full hover:bg-gray-700 transition" onClick={() => setIsSidebarOpen(false)}>
                            Login
                        </Link>
                    ) : (
                        <>
                            {userData?.role === "Admin" && (
                                <Link href="/dashboard/admin" className="hover:text-blue-400 transition" onClick={() => setIsSidebarOpen(false)}>Dashboard</Link>
                            )}
                            {userData?.role !== "User" && (
                                <Link href="/jobs/add" className="hover:text-blue-400 transition" onClick={() => setIsSidebarOpen(false)}>Add Jobs</Link>
                            )}
                            {userData?.role !== "User" && (
                                <Link href="/profiles" className="hover:text-blue-400 transition" onClick={() => setIsSidebarOpen(false)}>User Profiles</Link>
                            )}
                            <Link href={userData?.role === "User" ? "/applications/user" : "/applications"} className="hover:text-blue-400 transition" onClick={() => setIsSidebarOpen(false)}>
                                Applications
                            </Link>
                            {userData?.profileId ? (
                                <Link href={`/profiles/${userData._id}`} className="hover:text-blue-400 transition" onClick={() => setIsSidebarOpen(false)}>Profile</Link>
                            ) : (
                                <Link href="/profiles/add" className="hover:text-blue-400 transition" onClick={() => setIsSidebarOpen(false)}>Create Profile</Link>
                            )}
                            <button onClick={handleLogout} className="border border-gray-400 px-4 py-2 rounded-full hover:bg-gray-700 transition">
                                Logout
                            </button>
                        </>
                    )}
                </nav>
            </aside>
        </header>
    )
}

export default Navbar
