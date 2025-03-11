import API from "./api"

export const getProfiles = async () => {
  try {
    const response = await API.get("/api/profiles")
    return response.data
  } catch (error) {
    throw error.response?.data || "Failed to fetch profiles"
  }
}
export const getProfileById = async (userId) => {
  try {
    const response = await API.get(`/api/profiles/${userId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || "Failed to fetch profile"
  }
}
export const addProfile = async (profileData) => {
  try {
    const response = await API.post("/api/profiles/add", profileData)
    return response.data
  } catch (error) {
    throw error.response?.data || "Failed to add profile"
  }
}
export const updateProfile = async (profileData) => {
  try {
    const response = await API.put("/api/profiles/update", profileData)
    return response.data
  } catch (error) {
    throw error.response?.data || "Failed to update profile"
  }
}

export const uploadResume = async (file) => {
  const formData = new FormData()
  formData.append("resume", file)

  try {
    const response = await API.post("/api/profiles/upload-resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  } catch (error) {
    throw error.response?.data || "Failed to upload resume"
  }
}