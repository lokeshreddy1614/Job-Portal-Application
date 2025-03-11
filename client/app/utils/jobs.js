import API from "./api"

export const getJobs = async () => {
  try {
    const response = await API.get("/api/jobs")
    return response.data
  } catch (error) {
    throw error.response?.data || "Failed to fetch jobs"
  }
}

export const getJobById = async (jobId) => {
  try {
    const response = await API.get(`/api/jobs/${jobId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || "Failed to fetch job details"
  }
}

export const createJob = async (jobData) => {
  try {
    const response = await API.post("/api/jobs/add", jobData)
    return response.data
  } catch (error) {
    throw error.response?.data || "Failed to create job"
  }
}

export const updateJob = async (jobId, jobData) => {
  try {
    const response = await API.put(`/api/jobs/update/${jobId}`, jobData)
    return response.data
  } catch (error) {
    throw error.response?.data || "Failed to update job"
  }
}

export const deleteJob = async (jobId) => {
  try {
    const response = await API.delete(`/api/jobs/remove/${jobId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || "Failed to delete job"
  }
}
