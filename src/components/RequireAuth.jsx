import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RequireAuth = () => {
    const { currentUser } = useAuth()
    const location = useLocation()

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }

    return <Outlet />
}

export default RequireAuth
