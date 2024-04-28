import { useState } from "react"
import toast from "react-hot-toast"
import { useAuthContext } from "../context/AuthContext"

const useSignup = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const signup = async({ username, password, confirmPassword }) => {
    const success = handleInputErrors({ username, password, confirmPassword })
    if (!success) return

    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, confirmPassword })
      })

      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }

      localStorage.setItem("authUser", JSON.stringify(data))
      setAuthUser(data)

    } catch (error) {
      toast.error("Error: " + error.message)

    } finally {
      setLoading(false)
    }
  }

  return { loading, signup }
}

export default useSignup

function handleInputErrors({ username, password, confirmPassword }) {
  if (!username || !password || !confirmPassword) {
    toast.error("Please fill in all the fields")
    return false
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match")
    return false
  }

  if (password.length < 6) {
    toast.error("Passwords must be at least 6 characters")
    return false
  }

  return true
}