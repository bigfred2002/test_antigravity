import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext()
const AUTH_STORAGE_KEY = 'bee-auth-store'
const LOGIN_MAX_LENGTH = 20

const demoUser = {
    id: 'demo',
    name: 'Apiculteur Demo',
    login: 'apiculteur-demo',
    email: 'demo@ruche.expert',
    passwordHash:
        'f5a8d8f07f05ef103f50ef29aca5eb64839f25ee26029fd66d141c835c527b50',
    passwordSalt: 'demo-salt',
    avatar: 'AD',
    role: 'user',
}

const adminUser = {
    id: 'admin',
    name: 'Administrateur',
    login: 'admin',
    email: 'admin@ruche.expert',
    passwordHash:
        '4038d2775fbd37e6e49dd929146f442abec731bcafab7f6f07600241b1b847a6',
    passwordSalt: 'admin-salt',
    avatar: 'A',
    role: 'admin',
}

const generateSalt = () => {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const bytes = new Uint8Array(12)
        crypto.getRandomValues(bytes)
        return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
    }
    return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`
}

const hashPassword = async (password, salt) => {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
        throw new Error('Le navigateur ne prend pas en charge le hachage sécurisé des mots de passe.')
    }
    const encoder = new TextEncoder()
    const data = encoder.encode(`${salt}:${password}`)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
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
        const migrateLegacyPasswords = async () => {
            const hasPlainPassword = users.some((user) => user.password && !user.passwordHash)
            if (!hasPlainPassword) return

            try {
                const migrated = await Promise.all(
                    users.map(async (user) => {
                        if (user.password && !user.passwordHash) {
                            const passwordSalt = user.passwordSalt || generateSalt()
                            const passwordHash = await hashPassword(user.password, passwordSalt)
                            const rest = { ...user }
                            delete rest.password
                            return { ...rest, passwordHash, passwordSalt }
                        }
                        if (user.password) {
                            const rest = { ...user }
                            delete rest.password
                            return rest
                        }
                        return user
                    }),
                )
                setUsers(migrated)
            } catch (error) {
                console.error('Migration des mots de passe échouée', error)
            }
        }

        migrateLegacyPasswords()
    }, [users])

    useEffect(() => {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
        const sanitizedUsers = users.map((user) => {
            const sanitized = { ...user }
            delete sanitized.password
            return sanitized
        })
        localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({
                users: sanitizedUsers,
                currentUserId,
            }),
        )
    }, [users, currentUserId])

    const login = async (loginIdentifier, password) => {
        const normalizedIdentifier = loginIdentifier.trim().toLowerCase()
        if (!normalizedIdentifier) {
            throw new Error("L'identifiant est requis")
        }

        if (normalizedIdentifier.length > LOGIN_MAX_LENGTH) {
            throw new Error(`L'identifiant ne peut pas dépasser ${LOGIN_MAX_LENGTH} caractères`)
        }

        const user = users.find((candidate) => candidate.login?.toLowerCase() === normalizedIdentifier)
        if (!user?.passwordHash || !user.passwordSalt) {
            throw new Error('Authentification indisponible pour cet utilisateur')
        }

        const computedHash = await hashPassword(password, user.passwordSalt)
        if (computedHash !== user.passwordHash) {
            throw new Error('Identifiants incorrects')
        }
        setCurrentUserId(user.id)
        return user
    }

    const logout = () => setCurrentUserId(null)

    const register = async ({ login, email, password }) => {
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

        const passwordSalt = generateSalt()
        const passwordHash = await hashPassword(password, passwordSalt)

        const newUser = {
            id,
            name: normalizedLogin,
            login: normalizedLogin,
            email: normalizedEmail,
            passwordHash,
            passwordSalt,
            avatar,
            role: 'user',
        }
        setUsers((prev) => [...prev, newUser])
        setCurrentUserId(id)
        return newUser
    }

    const updateUserPassword = async (userId, newPassword) => {
        const passwordSalt = generateSalt()
        const passwordHash = await hashPassword(newPassword, passwordSalt)
        setUsers((prev) =>
            prev.map((user) =>
                user.id === userId
                    ? {
                          ...user,
                          passwordHash,
                          passwordSalt,
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
