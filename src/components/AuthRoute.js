import { getToken } from "@/utils/token"
import { Navigate } from "react-router-dom"
export function AuthRoute({ children }) {
    console.log('123');
    
    const token = getToken()
    if (token) {
        return <>{children}</>
    } else {
        console.log('123');
        return <Navigate to='/' replace />
    }
}
