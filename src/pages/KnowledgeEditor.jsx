import React, { useState } from 'react'
import { useBeeData } from '../context/BeeDataContext'

const KnowledgeEditor = () => {
    const { knowledge, updateKnowledge, addKnowledgeDocument, removeKnowledgeDocument } = useBeeData()
    const [contact, setContact] = useState({ name: '', detail: '' })
    const [site, setSite] = useState({ label: '', url: '' })
    const [documentTitle, setDocumentTitle] = useState('')
    const [uploadError, setUploadError] = useState('')

    const addContact = (event) => {
        event.preventDefault()
        if (!contact.name || !contact.detail) return
        updateKnowledge('contacts', (prev) => [
            ...prev,
            { ...contact, id: `contact-${Date.now()}` },
        ])
        setContact({ name: '', detail: '' })
    }

    const addSite = (event) => {
        event.preventDefault()
        if (!site.label || !site.url) return
        updateKnowledge('sites', (prev) => [...prev, { ...site, id: `site-${Date.now()}` }])
        setSite({ label: '', url: '' })
    }

    const addDocument = (event) => {
        event.preventDefault()
        if (!documentTitle) return
        const dataUrl = `data:text/plain;base64,${btoa(`Note ajoutée depuis l’éditeur : ${documentTitle}`)}`
        addKnowledgeDocument({ name: documentTitle, dataUrl, size: dataUrl.length })
        setDocumentTitle('')
    }

    const removeFromSection = (section, id) => {
        updateKnowledge(section, (prev) => prev.filter((item) => item.id !== id))
    }

    const handleDocumentUpload = (event) => {
        setUploadError('')
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (loadEvent) => {
            const dataUrl = loadEvent.target?.result
            if (typeof dataUrl !== 'string') {
                setUploadError('Impossible de lire le fichier, merci de réessayer.')
                return
            }
            addKnowledgeDocument({
                name: file.name,
                dataUrl,
                size: file.size,
            })
            event.target.value = ''
        }
        reader.onerror = () => {
            setUploadError('Lecture du fichier échouée.')
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Administration · Base de connaissance</p>
                    <h3>Modifier les ressources</h3>
                    <p className="panel-caption">
                        Ajoutez ou supprimez rapidement un contact, un lien ou un document de référence. Les
                        documents importés sont conservés localement et prêts à être téléchargés.
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
                            {knowledge.contacts.map((item) => (
                                <li key={item.id} className="record-line">
                                    <div>
                                        <strong>{item.name}</strong>
                                        <p className="muted">{item.detail}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-ghost"
                                        onClick={() => removeFromSection('contacts', item.id)}
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
                            {knowledge.sites.map((item) => (
                                <li key={item.id} className="record-line">
                                    <div>
                                        <strong>{item.label}</strong>
                                        <p className="muted">{item.url}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-ghost"
                                        onClick={() => removeFromSection('sites', item.id)}
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
                        <div className="definition-form compact">
                            <label className="form-field">
                                <span>Ajouter un document (texte rapide)</span>
                                <div className="upload-inline">
                                    <input
                                        type="text"
                                        name="document"
                                        placeholder="Titre du document"
                                        value={documentTitle}
                                        onChange={(event) => setDocumentTitle(event.target.value)}
                                    />
                                    <button type="button" className="btn-ghost" onClick={addDocument}>
                                        Générer
                                    </button>
                                </div>
                            </label>
                            <label className="form-field" htmlFor="documentUpload">
                                <span>Importer un fichier</span>
                                <div className="upload-inline">
                                    <input id="documentUpload" type="file" onChange={handleDocumentUpload} />
                                    <span className="muted small">Stocké localement et téléchargeable.</span>
                                </div>
                            </label>
                        </div>

                        {uploadError && (
                            <div className="alert error" role="status">
                                {uploadError}
                            </div>
                        )}

                        <ul className="muted">
                            {knowledge.documents.map((item) => (
                                <li key={item.id} className="record-line">
                                    <div>
                                        <strong>{item.name}</strong>
                                        <p className="muted small">
                                            {item.uploadedAt}
                                            {item.size ? ` · ${Math.round(item.size / 1024)} Ko` : ''}
                                        </p>
                                    </div>
                                    <div className="pill-row">
                                        <a className="pill" href={item.dataUrl || item.url} download={item.name}>
                                            Télécharger
                                        </a>
                                        <button
                                            type="button"
                                            className="btn-ghost"
                                            onClick={() => removeKnowledgeDocument(item.id)}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>
                </div>
            </section>
        </div>
    )
}

export default KnowledgeEditor
