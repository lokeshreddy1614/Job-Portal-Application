import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import getToken from '../utils/cookie'

const useAuthCheck = () => {
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            const token = await getToken()
            if (token) {
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
                router.push('/auth/login')
            }
            setLoading(false)
        }

        checkAuth()
    }, [router])

    return { isAuthenticated, loading }
}

export default useAuthCheck