import React from 'react'
import { BookOpen, Download, ExternalLink, Phone } from 'lucide-react'
import { useBeeData } from '../context/BeeDataContext'

const KnowledgeBase = () => {
    const { knowledge } = useBeeData()
    const documents = knowledge.documents || []

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Base de connaissance</p>
                    <h3>Ressources du rucher</h3>
                    <p className="panel-caption">
                        Centralisez vos contacts clés, vos liens utiles et vos documents opérationnels pour gagner du temps sur
                        le terrain.
                    </p>
                </div>
            </header>

            <section className="panel">
                <div className="definition-grid">
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Contacts</h4>
                            <Phone size={18} />
                        </div>
                        <ul className="muted">
                            {knowledge.contacts.map((contact) => (
                                <li key={contact.name}>
                                    <strong>{contact.name}</strong>
                                    <p>{contact.detail}</p>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Sites web</h4>
                            <ExternalLink size={18} />
                        </div>
                        <ul className="muted">
                            {knowledge.sites.map((site) => (
                                <li key={site.url}>
                                    <a href={site.url} target="_blank" rel="noreferrer" className="link">
                                        {site.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Documents</h4>
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
                            {!documents.length && <li className="muted">Aucun document enregistré pour le moment.</li>}
                        </ul>
                    </article>
                </div>
            </section>
        </div>
    )
}

export default KnowledgeBase
