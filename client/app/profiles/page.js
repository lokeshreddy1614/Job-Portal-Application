"use client"

import { getProfiles } from "@/app/utils/profile"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import DataContext from "../context/DataContext"
import useAuthCheck from "../hooks/useAuthCheck"
import Loading from "../components/Loading"

const ProfilesPage = () => {

  const { isAuthenticated, loading } = useAuthCheck()

  const [profiles, setProfiles] = useState([])

  const router = useRouter()

  const { setUserData } = useContext(DataContext)

  const fetchProfiles = async () => {
    const response = await getProfiles()
    setUserData(response.user)
    setProfiles(response.candidates)
    console.log(response.candidates)
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfiles()
    }
  }, [isAuthenticated])

  if (loading) {
    return (<Loading />)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {isAuthenticated && (
        <>
          <h2 className="text-3xl font-bold text-center text-gray-300 mb-6">Candidate Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map(profile => (
              <div
                onClick={() => router.push(`profiles/${profile.userId._id}`)}
                key={profile._id}
                className="bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition duration-300"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-100">{profile.userId.name}</h3>
                  <span className="text-sm font-medium text-white bg-blue-600/80 px-3 py-1 rounded-lg">
                    {profile.userId.role}
                  </span>
                </div>
                <p className="text-gray-400">{profile.userId.email}</p>
                <p className="text-gray-300 mt-2">Education: {profile.education}</p>
                <p className="text-gray-300">Experience: {profile.experience} years</p>
                <p className="text-gray-300">Location: {profile.location}</p>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-200">Skills:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-700 text-blue-100 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ProfilesPage
