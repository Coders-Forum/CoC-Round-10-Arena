import { Navigate } from "react-router-dom"
import { isLoggedIn } from "../utils/sessionSecurity"

export default function ProtectedRoute({ children }) {
    if (!isLoggedIn()) {
        return <Navigate to="/" replace />
    }
    return children
}
