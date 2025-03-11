"use client"

const { createContext, useState, useEffect } = require("react");

const DataContext = createContext()

export const DataProvider = ({ children }) => {

    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isLogin, setIsLogin] = useState(false)
    const [tokenValue, setTokenValue] = useState("")

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserData = JSON.parse(localStorage.getItem("userData"));
            setUserData(storedUserData)
            setIsLoading(false)
        }
    }, [setUserData])

    useEffect(() => {
        if (tokenValue) {
            setIsLogin(true)
        }
    }, [tokenValue])


    useEffect(() => {
        setIsLoading(false)
    }, [])

    return (
        <DataContext.Provider
            value={{
                userData, setUserData,
                isLoading, setIsLoading,
                isLogin, setIsLogin,
                setTokenValue, tokenValue
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default DataContext