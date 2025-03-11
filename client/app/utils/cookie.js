"use server"

import { cookies } from "next/headers"

const getToken = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")
    return token?.value
}

export default getToken