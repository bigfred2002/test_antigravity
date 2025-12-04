import React, { useState } from 'react'
import { Phone, UserRoundPlus } from 'lucide-react'
import { useBeeData } from '../context/BeeDataContext'

const ContactManager = () => {
    const { knowledge, updateKnowledge } = useBeeData()
    const [contact, setContact] = useState({ name: '', detail: '' })

    const addContact = (event) => {
        event.preventDefault()
        if (!contact.name || !contact.detail) return
        updateKnowledge('contacts', (prev) => [...prev, { ...contact, id: `contact-${Date.now()}` }])
        setContact({ name: '', detail: '' })
    }

    const removeContact = (id) => {
        updateKnowledge('contacts', (prev) => prev.filter((item) => item.id !== id))
    }

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Administration · Base de connaissance</p>
                    <h3>Gestion des contacts</h3>
                    <p className="panel-caption">
                        Ajoutez, mettez à jour ou retirez les personnes ressources pour vos interventions apicoles.
                    </p>
                </div>
                <div className="pill">{knowledge.contacts.length} contact(s)</div>
            </header>

            <section className="panel">
                <div className="definition-grid">
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Contacts enregistrés</h4>
                            <Phone size={18} />
                        </div>
                        <ul className="muted">
                            {knowledge.contacts.map((item) => (
                                <li key={item.id} className="record-line">
                                    <div>
                                        <strong>{item.name}</strong>
                                        <p className="muted">{item.detail}</p>
                                    </div>
                                    <button type="button" className="btn-ghost" onClick={() => removeContact(item.id)}>
                                        Retirer
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {!knowledge.contacts.length && <p className="muted">Aucun contact pour le moment.</p>}
                    </article>

                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Ajouter un contact</h4>
                            <UserRoundPlus size={18} />
                        </div>
                        <form className="definition-form compact" onSubmit={addContact}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Nom"
                                value={contact.name}
                                onChange={(event) => setContact((prev) => ({ ...prev, name: event.target.value }))}
                            />
                            <input
                                type="text"
                                name="detail"
                                placeholder="Coordonnées"
                                value={contact.detail}
                                onChange={(event) => setContact((prev) => ({ ...prev, detail: event.target.value }))}
                            />
                            <button type="submit" className="btn-primary">
                                Enregistrer
                            </button>
                        </form>
                    </article>
                </div>
            </section>
        </div>
    )
}

export default ContactManager
