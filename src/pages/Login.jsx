import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const { login, register, demoUserId, currentUser, users } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const redirectPath = location.state?.from || '/'
    const [loginIdentifier, setLoginIdentifier] = useState('apiculteur-demo')
    const [loginPassword, setLoginPassword] = useState('demo')
    const [registerData, setRegisterData] = useState({ login: '', email: '', password: '' })
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [activeModal, setActiveModal] = useState(null)

    const closeModals = () => {
        setActiveModal(null)
        setError('')
        setMessage('')
    }

    const handleLogin = (event) => {
        event.preventDefault()
        setError('')
        setMessage('')
        try {
            const user = login(loginIdentifier, loginPassword)
            setMessage(`Bienvenue ${user.name}`)
            navigate(redirectPath)
            closeModals()
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
            setRegisterData({ login: '', email: '', password: '' })
            navigate('/')
            closeModals()
        } catch (err) {
            setError(err.message)
        }
    }

    const connectDemo = () => {
        setLoginIdentifier('apiculteur-demo')
        setLoginPassword('demo')
        setMessage('Connexion au compte démo...')
        setError('')
        try {
            login('apiculteur-demo', 'demo')
            navigate('/')
            closeModals()
        } catch (err) {
            setError(err.message)
            setMessage('')
        }
    }

    const connectAdmin = () => {
        setLoginIdentifier('admin')
        setLoginPassword('admin')
        setMessage('Connexion au compte administrateur...')
        setError('')
        try {
            login('admin', 'admin')
            navigate('/')
            closeModals()
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
                    <div className="auth-card auth-card--option">
                        <div className="auth-card__header">
                            <h3>Se connecter</h3>
                            <p className="muted small">Utilisez votre identifiant (20 caractères max.) et votre mot de passe.</p>
                        </div>
                        <div className="pill-row">
                            <button type="button" className="pill" onClick={connectDemo}>
                                Compte démo
                            </button>
                            <button type="button" className="pill" onClick={connectAdmin}>
                                Compte admin
                            </button>
                        </div>
                        <button type="button" className="btn-primary" onClick={() => setActiveModal('login')}>
                            Ouvrir la fenêtre de connexion
                        </button>
                    </div>

                    <div className="auth-card auth-card--option">
                        <div className="auth-card__header">
                            <h3>Créer un compte</h3>
                            <p className="muted small">Renseignez un identifiant, un email et un mot de passe.</p>
                        </div>
                        <p className="muted small">Le compte admin reste disponible pour gérer les utilisateurs.</p>
                        <button type="button" className="btn-ghost" onClick={() => setActiveModal('register')}>
                            Ouvrir la fenêtre de création
                        </button>
                    </div>
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
                                        {user.name} {user.id === demoUserId ? '(démo)' : ''} {user.id === 'admin' ? '(admin)' : ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <Link to="/" className="link">
                        Retour à l’accueil
                    </Link>
                </div>

                {activeModal === 'login' && (
                    <div className="modal-overlay" role="dialog" aria-modal="true">
                        <div className="modal">
                            <div className="modal-header">
                                <h3>Connexion</h3>
                                <button type="button" className="icon-button" onClick={closeModals} aria-label="Fermer">
                                    ×
                                </button>
                            </div>
                            <form className="modal-body" onSubmit={handleLogin}>
                                <label className="form-field">
                                    <span>Identifiant</span>
                                    <input
                                        type="text"
                                        value={loginIdentifier}
                                        onChange={(e) => setLoginIdentifier(e.target.value)}
                                        required
                                        placeholder="Ex : apiculteur-demo"
                                        maxLength={20}
                                    />
                                </label>
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
                                <div className="pill-row">
                                    <button type="button" className="pill" onClick={connectDemo}>
                                        Préremplir le compte démo
                                    </button>
                                    <button type="button" className="pill" onClick={connectAdmin}>
                                        Préremplir le compte admin
                                    </button>
                                </div>
                                <button type="submit" className="btn-primary">
                                    Se connecter
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {activeModal === 'register' && (
                    <div className="modal-overlay" role="dialog" aria-modal="true">
                        <div className="modal">
                            <div className="modal-header">
                                <h3>Créer un compte</h3>
                                <button type="button" className="icon-button" onClick={closeModals} aria-label="Fermer">
                                    ×
                                </button>
                            </div>
                            <form className="modal-body" onSubmit={handleRegister}>
                                <label className="form-field">
                                    <span>Identifiant</span>
                                    <input
                                        type="text"
                                        value={registerData.login}
                                        onChange={(e) => setRegisterData((prev) => ({ ...prev, login: e.target.value }))}
                                        required
                                        placeholder="Choisissez votre identifiant"
                                        maxLength={20}
                                    />
                                </label>
                                <label className="form-field">
                                    <span>Email</span>
                                    <input
                                        type="email"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                                        required
                                        placeholder="vous@exemple.com"
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
                                <p className="muted small">
                                    Le compte admin reste disponible pour gérer les utilisateurs déjà présents.
                                </p>
                                <button type="submit" className="btn-primary">
                                    Créer et se connecter
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Login
