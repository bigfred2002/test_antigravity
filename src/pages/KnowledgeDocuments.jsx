import React from 'react'
import { BookOpen, Download } from 'lucide-react'
import { useBeeData } from '../context/BeeDataContext'

const KnowledgeDocuments = () => {
    const { knowledge } = useBeeData()
    const documents = knowledge.documents || []

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Base de connaissance</p>
                    <h3>Documents utiles</h3>
                    <p className="panel-caption">
                        Téléchargez vos procédures, check-lists et notes d’exploitation directement depuis le rucher.
                    </p>
                </div>
                <div className="pill">{documents.length} document(s)</div>
            </header>

            <section className="panel">
                <div className="definition-grid">
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Documents à télécharger</h4>
                            <BookOpen size={18} />
                        </div>
                        <ul className="muted document-list">
                            {documents.map((doc) => (
                                <li key={doc.id} className="record-line">
                                    <div>
                                        <strong>{doc.name}</strong>
                                        <p className="muted small">
                                            Ajouté le {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                                            {doc.size ? ` · ${Math.round(doc.size / 1024)} Ko` : ''}
                                        </p>
                                    </div>
                                    <a
                                        className="pill"
                                        href={doc.dataUrl || doc.url}
                                        download={doc.name}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Download size={16} /> Télécharger
                                    </a>
                                </li>
                            ))}
                        </ul>
                        {!documents.length && <p className="muted">Aucun document à afficher.</p>}
                    </article>
                </div>
            </section>
        </div>
    )
}

export default KnowledgeDocuments
