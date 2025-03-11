"use client"

import DataContext from '@/app/context/DataContext'
import useAuthCheck from "../../hooks/useAuthCheck"
import { getSystemAnalytics, updateUserRole } from '@/app/utils/admin'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Loading from '@/app/components/Loading'

const AdminDashboardPage = () => {

    const { isAuthenticated, loading } = useAuthCheck()

    const { userData, setUserData, setIsLogin } = useContext(DataContext)
    const [analyticsData, setAnalyticsData] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const [newRole, setNewRole] = useState("")
    const [showConfirm, setShowConfirm] = useState(false)

    const getAnalytics = async () => {
        if (!isAuthenticated) return
        try {
            const response = await getSystemAnalytics()
            setAnalyticsData(response)
            setUserData(response.admin)
            setIsLogin(true)
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch analytics")
        }
    }

    const handleChange = (e, user) => {
        setSelectedUser(user)
        setNewRole(e.target.value)
        setShowConfirm(true)
    }

    const confirmChange = async () => {
        try {
            await updateUserRole({ email: selectedUser.email, newRole })
            await getAnalytics()
            toast.success("User role updated successfully")
        } catch (error) {
            toast.error("Failed to update role")
        } finally {
            setShowConfirm(false)
            setSelectedUser(null)
            setNewRole("")
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            getAnalytics()
        } else {
            setAnalyticsData(null)
        }
    }, [getAnalytics, isAuthenticated])

    if (loading) {
        return (<Loading />)
    }

    return (
        <>
            <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
                {isAuthenticated && (
                    <div className="bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-4xl">
                        <h1 className="text-3xl font-bold text-center mb-6">
                            System Analytics
                        </h1>
                        {analyticsData ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                                    <div className="p-6 bg-blue-600 rounded-lg text-center shadow-md">
                                        <p className="text-lg">
                                            Total Applications
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {analyticsData?.totalApplications || 0}
                                        </p>
                                    </div>
                                    <div className="p-6 bg-green-600 rounded-lg text-center shadow-md">
                                        <p className="text-lg">
                                            Total Candidates
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {analyticsData?.totalCandidates || 0}
                                        </p>
                                    </div>
                                    <div className="p-6 bg-yellow-600 rounded-lg text-center shadow-md">
                                        <p className="text-lg">
                                            Total Users
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {analyticsData?.totalUsers || 0}
                                        </p>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-semibold mb-4">
                                    Users
                                </h2>
                                <div className="bg-gray-700 shadow-sm rounded-lg p-6">
                                    {analyticsData?.users?.length > 0 ? (
                                        analyticsData.users.map((user) => (
                                            <div
                                                key={user._id}
                                                className="flex justify-between items-center p-3 border-b border-gray-600 last:border-none"
                                            >
                                                <p className="font-medium">
                                                    {user.name}
                                                </p>
                                                {userData?._id !== user._id ? (
                                                    <select
                                                        className="border border-gray-500 rounded-md px-3 py-2 bg-gray-800 text-white"
                                                        value={user.role}
                                                        onChange={(e) => handleChange(e, user)}
                                                    >
                                                        <option value="User">
                                                            User
                                                        </option>
                                                        <option value="HR">
                                                            HR
                                                        </option>
                                                        <option value="Manager">
                                                            Manager
                                                        </option>
                                                        <option value="Admin">
                                                            Admin
                                                        </option>
                                                    </select>
                                                ) : (
                                                    <p className="text-gray-400">
                                                        {user.role}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-center">
                                            No users found
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-400 text-center">
                                No data available
                            </p>
                        )}
                    </div>
                )}
            </div>

            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-semibold mb-4">
                            Are you sure you want to change the role?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                onClick={() => setShowConfirm(false)}
                            >
                                No
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                onClick={confirmChange}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AdminDashboardPage
