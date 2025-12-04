import React, { useState } from 'react'
import { useBeeData } from '../context/BeeDataContext'

const KnowledgeEditor = () => {
    const { knowledge, updateKnowledge } = useBeeData()
    const [contact, setContact] = useState({ name: '', detail: '' })
    const [site, setSite] = useState({ label: '', url: '' })
    const [documentTitle, setDocumentTitle] = useState('')

    const addContact = (event) => {
        event.preventDefault()
        if (!contact.name || !contact.detail) return
        updateKnowledge('contacts', (prev) => [...prev, contact])
        setContact({ name: '', detail: '' })
    }

    const addSite = (event) => {
        event.preventDefault()
        if (!site.label || !site.url) return
        updateKnowledge('sites', (prev) => [...prev, site])
        setSite({ label: '', url: '' })
    }

    const addDocument = (event) => {
        event.preventDefault()
        if (!documentTitle) return
        updateKnowledge('documents', (prev) => [...prev, documentTitle])
        setDocumentTitle('')
    }

    const removeFromSection = (section, index) => {
        updateKnowledge(section, (prev) => prev.filter((_, idx) => idx !== index))
    }

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Base de connaissance</p>
                    <h3>Modifier les ressources</h3>
                    <p className="panel-caption">
                        Ajoutez ou supprimez rapidement un contact, un lien ou un document de référence.
                    </p>
                </div>
            </header>

            <section className="panel">
                <div className="definition-grid">
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Contacts</h4>
                        </div>
                        <ul className="muted">
                            {knowledge.contacts.map((item, index) => (
                                <li key={`${item.name}-${index}`} className="record-line">
                                    <div>
                                        <strong>{item.name}</strong>
                                        <p className="muted">{item.detail}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-ghost"
                                        onClick={() => removeFromSection('contacts', index)}
                                    >
                                        Retirer
                                    </button>
                                </li>
                            ))}
                        </ul>
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
                                Ajouter
                            </button>
                        </form>
                    </article>

                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Sites web</h4>
                        </div>
                        <ul className="muted">
                            {knowledge.sites.map((item, index) => (
                                <li key={`${item.url}-${index}`} className="record-line">
                                    <div>
                                        <strong>{item.label}</strong>
                                        <p className="muted">{item.url}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-ghost"
                                        onClick={() => removeFromSection('sites', index)}
                                    >
                                        Retirer
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <form className="definition-form compact" onSubmit={addSite}>
                            <input
                                type="text"
                                name="label"
                                placeholder="Libellé"
                                value={site.label}
                                onChange={(event) => setSite((prev) => ({ ...prev, label: event.target.value }))}
                            />
                            <input
                                type="url"
                                name="url"
                                placeholder="https://..."
                                value={site.url}
                                onChange={(event) => setSite((prev) => ({ ...prev, url: event.target.value }))}
                            />
                            <button type="submit" className="btn-primary">
                                Ajouter
                            </button>
                        </form>
                    </article>

                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Documents</h4>
                        </div>
                        <ul className="muted">
                            {knowledge.documents.map((item, index) => (
                                <li key={`${item}-${index}`} className="record-line">
                                    <div>{item}</div>
                                    <button
                                        type="button"
                                        className="btn-ghost"
                                        onClick={() => removeFromSection('documents', index)}
                                    >
                                        Retirer
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <form className="definition-form compact" onSubmit={addDocument}>
                            <input
                                type="text"
                                name="document"
                                placeholder="Titre du document"
                                value={documentTitle}
                                onChange={(event) => setDocumentTitle(event.target.value)}
                            />
                            <button type="submit" className="btn-primary">
                                Ajouter
                            </button>
                        </form>
                    </article>
                </div>
            </section>
        </div>
    )
}

export default KnowledgeEditor
