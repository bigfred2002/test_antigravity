import React, { useMemo, useState } from 'react'
import { KeyRound, Shield, Trash2, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const UserManagement = () => {
    const { users, currentUser, deleteUser, updateUserPassword } = useAuth()
    const [passwords, setPasswords] = useState({})
    const [feedback, setFeedback] = useState('')

    const protectedIds = useMemo(() => new Set(['admin', 'demo']), [])
    const isAdmin = currentUser?.role === 'admin'

    const handlePasswordChange = async (userId) => {
        const nextPassword = passwords[userId]
        if (!nextPassword) return
        try {
            await updateUserPassword(userId, nextPassword)
            setFeedback('Mot de passe mis à jour.')
        } catch (error) {
            setFeedback(error.message || 'Impossible de mettre à jour le mot de passe.')
        }
    }

    const handleDelete = (userId) => {
        deleteUser(userId)
        setFeedback('Utilisateur supprimé.')
    }

    if (!isAdmin) {
        return (
            <div className="alert error" role="alert">
                Accès réservé à l’administrateur.
            </div>
        )
    }

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Administration</p>
                    <h3>Gestion des utilisateurs</h3>
                    <p className="panel-caption">
                        Modifier les mots de passe, supprimer un compte ou vérifier le rôle des utilisateurs.
                    </p>
                </div>
            </header>

            <section className="panel">
                <div className="definition-grid">
                    {users.map((user) => {
                        const isProtected = protectedIds.has(user.id)
                        return (
                            <article key={user.id} className="definition-card">
                                <div className="card-header">
                                    <div>
                                        <p className="eyebrow">{user.login}</p>
                                        <h4>{user.name}</h4>
                                    </div>
                                    <Shield size={18} className={user.role === 'admin' ? 'text-success' : ''} />
                                </div>
                                <p className="muted">
                                    Rôle : {user.role === 'admin' ? 'Administrateur' : 'Apiculteur'}
                                </p>
                                {isProtected && (
                                    <p className="muted small">Ce compte est protégé et ne peut pas être supprimé.</p>
                                )}
                                <div className="definition-form">
                                    <label className="form-field">
                                        <span>Nouveau mot de passe</span>
                                        <input
                                            type="password"
                                            value={passwords[user.id] || ''}
                                            onChange={(event) =>
                                                setPasswords((prev) => ({ ...prev, [user.id]: event.target.value }))
                                            }
                                            placeholder="••••••••"
                                        />
                                    </label>
                                    <div className="pill-row">
                                        <button
                                            type="button"
                                            className="btn-primary"
                                            onClick={() => handlePasswordChange(user.id)}
                                            disabled={!passwords[user.id]}
                                        >
                                            <KeyRound size={16} /> Mettre à jour
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-ghost"
                                            disabled={isProtected || user.id === currentUser?.id}
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            <Trash2 size={16} /> Supprimer
                                        </button>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </section>

            {feedback && (
                <div className="alert success" role="status">
                    {feedback}
                </div>
            )}

            <section className="panel">
                <div className="card-header">
                    <div>
                        <p className="eyebrow">Aide mémoire</p>
                        <h4>Connexions rapides</h4>
                    </div>
                    <UserPlus size={18} />
                </div>
                <div className="pill-row">
                    <div className="pill">Administrateur · login : admin · mot de passe : admin</div>
                    <div className="pill">Compte démo · login : apiculteur-demo · mot de passe : demo</div>
                </div>
            </section>
        </div>
    )
}

export default UserManagement
