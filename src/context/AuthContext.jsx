import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext()
const AUTH_STORAGE_KEY = 'bee-auth-store'
const LOGIN_MAX_LENGTH = 20

const demoUser = {
    id: 'demo',
    name: 'Apiculteur Demo',
    login: 'apiculteur-demo',
    email: 'demo@ruche.expert',
    password: 'demo',
    avatar: 'AD',
    role: 'user',
}

const adminUser = {
    id: 'admin',
    name: 'Administrateur',
    login: 'admin',
    email: 'admin@ruche.expert',
    password: 'admin',
    avatar: 'A',
    role: 'admin',
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
    const [users, setUsers] = useState(() => {
        const initialUsers = persisted?.users?.length ? persisted.users : []
        const byId = new Map()

        ;[adminUser, demoUser, ...initialUsers].forEach((user) => {
            const normalized = {
                ...user,
                login: user.login || user.name,
                email: user.email || '',
                role: user.role || 'user',
            }
            byId.set(normalized.id, normalized)
        })

        return Array.from(byId.values())
    })
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

    const login = (loginIdentifier, password) => {
        const normalizedIdentifier = loginIdentifier.trim().toLowerCase()
        if (!normalizedIdentifier) {
            throw new Error("L'identifiant est requis")
        }

        if (normalizedIdentifier.length > LOGIN_MAX_LENGTH) {
            throw new Error(`L'identifiant ne peut pas dépasser ${LOGIN_MAX_LENGTH} caractères`)
        }

        const user = users.find((candidate) => candidate.login?.toLowerCase() === normalizedIdentifier)
        if (!user || user.password !== password) {
            throw new Error('Identifiants incorrects')
        }
        setCurrentUserId(user.id)
        return user
    }

    const logout = () => setCurrentUserId(null)

    const register = ({ login, email, password }) => {
        const normalizedLogin = login.trim()
        const normalizedEmail = email.trim().toLowerCase()

        if (!normalizedLogin || !normalizedEmail || !password) {
            throw new Error('Tous les champs sont obligatoires')
        }

        if (normalizedLogin.length > LOGIN_MAX_LENGTH) {
            throw new Error(`L'identifiant ne peut pas dépasser ${LOGIN_MAX_LENGTH} caractères`)
        }

        if (users.some((user) => user.login.toLowerCase() === normalizedLogin.toLowerCase())) {
            throw new Error('Un compte existe déjà avec cet identifiant')
        }

        if (users.some((user) => user.email?.toLowerCase() === normalizedEmail)) {
            throw new Error('Un compte existe déjà avec cet email')
        }

        if (password.length < 4) {
            throw new Error('Le mot de passe doit contenir au moins 4 caractères')
        }

        const id = `user-${Date.now()}`
        const avatar = normalizedLogin
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()

        const newUser = {
            id,
            name: normalizedLogin,
            login: normalizedLogin,
            email: normalizedEmail,
            password,
            avatar,
            role: 'user',
        }
        setUsers((prev) => [...prev, newUser])
        setCurrentUserId(id)
        return newUser
    }

    const updateUserPassword = (userId, newPassword) => {
        setUsers((prev) =>
            prev.map((user) =>
                user.id === userId
                    ? {
                          ...user,
                          password: newPassword,
                      }
                    : user,
            ),
        )
    }

    const deleteUser = (userId) => {
        const protectedIds = new Set([demoUser.id, adminUser.id])
        if (protectedIds.has(userId)) return
        setUsers((prev) => prev.filter((user) => user.id !== userId))
        if (currentUserId === userId) {
            setCurrentUserId(null)
        }
    }

    const value = {
        users,
        currentUser,
        login,
        logout,
        register,
        deleteUser,
        updateUserPassword,
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
