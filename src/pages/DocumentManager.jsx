import React, { useState } from 'react'
import { BookPlus, FileSignature } from 'lucide-react'
import { useBeeData } from '../context/BeeDataContext'

const DocumentManager = () => {
    const { knowledge, addKnowledgeDocument, removeKnowledgeDocument } = useBeeData()
    const [documentTitle, setDocumentTitle] = useState('')
    const [uploadError, setUploadError] = useState('')

    const addDocument = (event) => {
        event.preventDefault()
        if (!documentTitle) return
        const dataUrl = `data:text/plain;base64,${btoa(`Note ajoutée depuis l’éditeur : ${documentTitle}`)}`
        addKnowledgeDocument({ name: documentTitle, dataUrl, size: dataUrl.length })
        setDocumentTitle('')
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
                    <h3>Gestion des documents</h3>
                    <p className="panel-caption">Stockez vos procédures et fichiers clés pour y accéder hors connexion.</p>
                </div>
                <div className="pill">{knowledge.documents.length} document(s)</div>
            </header>

            <section className="panel">
                <div className="definition-grid">
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Ajouter un document</h4>
                            <BookPlus size={18} />
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

                        {uploadError && <div className="alert error">{uploadError}</div>}
                    </article>

                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Documents enregistrés</h4>
                            <FileSignature size={18} />
                        </div>
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
                        {!knowledge.documents.length && <p className="muted">Aucun document enregistré.</p>}
                    </article>
                </div>
            </section>
        </div>
    )
}

export default DocumentManager
