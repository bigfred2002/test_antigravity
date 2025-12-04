import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const { login, register, demoUserId, currentUser, users } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const redirectPath = location.state?.from || '/'
    const [loginName, setLoginName] = useState('Apiculteur Demo')
    const [loginPassword, setLoginPassword] = useState('demo')
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' })
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleLogin = (event) => {
        event.preventDefault()
        setError('')
        setMessage('')
        try {
            const user = login(loginName, loginPassword)
            setMessage(`Bienvenue ${user.name}`)
            navigate(redirectPath)
        } catch (err) {
            setError(err.message)
        }
    }

    const handleRegister = (event) => {
        event.preventDefault()
        setError('')
        setMessage('')
        try {
            const newUser = register(registerData)
            setMessage(`Compte créé pour ${newUser.name}`)
            setRegisterData({ name: '', email: '', password: '' })
            navigate('/')
        } catch (err) {
            setError(err.message)
        }
    }

    const connectDemo = () => {
        setLoginName('Apiculteur Demo')
        setLoginPassword('demo')
        setMessage('Connexion au compte démo...')
        setError('')
        try {
            login('Apiculteur Demo', 'demo')
            navigate('/')
        } catch (err) {
            setError(err.message)
            setMessage('')
        }
    }

    return (
        <div className="auth-layout">
            <div className="auth-illustration" aria-hidden="true">
                <div className="auth-overlay">
                    <p className="eyebrow">Ruche Expert</p>
                    <h2>Gérez plusieurs apiculteurs sur un même espace</h2>
                    <p className="muted">
                        Invitez vos collègues, basculez entre les comptes et gardez des données séparées pour chaque
                        rucher.
                    </p>
                    <ul className="auth-list">
                        <li>Compte démo pré-rempli</li>
                        <li>Données isolées pour chaque utilisateur</li>
                        <li>Import / export par apiculteur</li>
                    </ul>
                    <div className="demo-badge">Mot de passe du compte démo : demo</div>
                </div>
            </div>
            <div className="auth-panel">
                <div className="auth-header">
                    <h1>Connexion</h1>
                    <p className="muted">Identifiez-vous pour accéder à votre carnet apicole.</p>
                    {currentUser && (
                        <p className="muted small">Connecté en tant que {currentUser.name}. Vous pouvez changer de compte ci-dessous.</p>
                    )}
                </div>

                <div className="auth-grid">
                    <form className="auth-card" onSubmit={handleLogin}>
                        <div className="auth-card__header">
                            <h3>Se connecter</h3>
                            <button type="button" className="pill" onClick={connectDemo}>
                                Utiliser le compte démo
                            </button>
                        </div>
                        <label className="form-field">
                            <span>Nom</span>
                            <input
                                type="text"
                                value={loginName}
                                onChange={(e) => setLoginName(e.target.value)}
                                required
                                placeholder="Nom de votre apiculteur"
                            />
                        </label>
                        <p className="muted small">Connexion par nom d’apiculteur et mot de passe.</p>
                        <label className="form-field">
                            <span>Mot de passe</span>
                            <input
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </label>
                        <button type="submit" className="btn-primary">
                            Connexion
                        </button>
                    </form>

                    <form className="auth-card" onSubmit={handleRegister}>
                        <h3>Créer un compte apiculteur</h3>
                        <label className="form-field">
                            <span>Nom complet</span>
                            <input
                                type="text"
                                value={registerData.name}
                                onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                                required
                                placeholder="Ex : Rucher des Coteaux"
                            />
                        </label>
                        <label className="form-field">
                            <span>Email</span>
                            <input
                                type="email"
                                value={registerData.email}
                                onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                                required
                                placeholder="contact@rucher.fr"
                            />
                        </label>
                        <label className="form-field">
                            <span>Mot de passe</span>
                            <input
                                type="password"
                                value={registerData.password}
                                onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                                required
                                minLength={4}
                                placeholder="Choisissez un code"
                            />
                        </label>
                        <button type="submit" className="btn-ghost">
                            Créer et se connecter
                        </button>
                    </form>
                </div>

                {(error || message) && (
                    <div className={`auth-alert ${error ? 'error' : 'success'}`} role="status">
                        {error || message}
                    </div>
                )}

                <div className="auth-footer">
                    <p className="muted small">
                        Astuce : le compte démo contient toutes les données d’exemple (ruchers, ruches, récoltes) et se
                        déverrouille avec le mot de passe « demo ».
                    </p>
                    {users.length > 1 && (
                        <div className="auth-users">
                            <p className="eyebrow">Comptes disponibles</p>
                            <div className="pill-row">
                                {users.map((user) => (
                                    <span className="pill" key={user.id}>
                                        {user.name} {user.id === demoUserId ? '(démo)' : ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <Link to="/" className="link">
                        Retour à l’accueil
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login
