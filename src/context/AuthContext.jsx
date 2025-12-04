import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext()
const AUTH_STORAGE_KEY = 'bee-auth-store'

const demoUser = {
    id: 'demo',
    name: 'Apiculteur Demo',
    email: 'demo@ruche.expert',
    password: 'demo',
    avatar: 'AD',
}

const loadPersistedAuth = () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch (error) {
        console.warn('Impossible de charger les comptes', error)
        return null
    }
}

export const AuthProvider = ({ children }) => {
    const persisted = loadPersistedAuth()
    const [users, setUsers] = useState(() => (persisted?.users?.length ? persisted.users : [demoUser]))
    const [currentUserId, setCurrentUserId] = useState(() => persisted?.currentUserId || null)

    const currentUser = useMemo(
        () => users.find((user) => user.id === currentUserId) || null,
        [users, currentUserId],
    )

    useEffect(() => {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
        localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({
                users,
                currentUserId,
            }),
        )
    }, [users, currentUserId])

    const login = (email, password) => {
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (!user || user.password !== password) {
            throw new Error('Identifiants incorrects')
        }
        setCurrentUserId(user.id)
        return user
    }

    const logout = () => setCurrentUserId(null)

    const register = ({ name, email, password }) => {
        if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('Un compte existe déjà avec cet email')
        }

        const id = `user-${Date.now()}`
        const avatar = name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()

        const newUser = { id, name, email, password, avatar }
        setUsers((prev) => [...prev, newUser])
        setCurrentUserId(id)
        return newUser
    }

    const value = {
        users,
        currentUser,
        login,
        logout,
        register,
        demoUserId: demoUser.id,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
