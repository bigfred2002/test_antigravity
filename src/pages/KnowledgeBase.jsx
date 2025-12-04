import React from 'react'
import { BookOpen, ExternalLink, Phone } from 'lucide-react'

const resources = {
    contacts: [
        { name: 'Vétérinaire sanitaire', detail: 'Dr. L. Marchand — 06 45 22 10 98' },
        { name: 'Fournisseur bois', detail: 'Menuiserie des Roches — 05 87 41 22 15' },
        { name: 'Groupement apicole local', detail: 'Association Abeilles & Terroirs' },
    ],
    sites: [
        { label: 'Guide des bonnes pratiques', url: 'https://agriculture.gouv.fr/apiculture' },
        { label: 'Bulletin météo agricole', url: 'https://meteofrance.com' },
        { label: 'Forum apiculteurs francophones', url: 'https://www.apiculture-france.com' },
    ],
    documents: [
        'Procédure de nourrissement printemps',
        'Check-list visite de production',
        'Protocole de renouvellement des reines',
    ],
}

const KnowledgeBase = () => {
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
                            {resources.contacts.map((contact) => (
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
                            {resources.sites.map((site) => (
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
                        <ul className="muted">
                            {resources.documents.map((doc) => (
                                <li key={doc}>{doc}</li>
                            ))}
                        </ul>
                    </article>
                </div>
            </section>
        </div>
    )
}

export default KnowledgeBase
