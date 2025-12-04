import React from 'react'
import { Phone, UserRoundSearch } from 'lucide-react'
import { useBeeData } from '../context/BeeDataContext'

const KnowledgeContacts = () => {
    const { knowledge } = useBeeData()

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Base de connaissance</p>
                    <h3>Contacts apicoles</h3>
                    <p className="panel-caption">
                        Gardez à portée de main les personnes clés à prévenir ou à consulter pour vos interventions.
                    </p>
                </div>
                <div className="pill">{knowledge.contacts.length} contact(s)</div>
            </header>

            <section className="panel">
                <div className="definition-grid">
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Contacts sauvegardés</h4>
                            <Phone size={18} />
                        </div>
                        <ul className="muted">
                            {knowledge.contacts.map((contact) => (
                                <li key={contact.id} className="record-line">
                                    <div>
                                        <strong>{contact.name}</strong>
                                        <p className="muted">{contact.detail}</p>
                                    </div>
                                    <span className="pill">Référence</span>
                                </li>
                            ))}
                        </ul>
                        {!knowledge.contacts.length && (
                            <div className="empty">
                                <UserRoundSearch size={18} /> Aucun contact enregistré pour le moment.
                            </div>
                        )}
                    </article>
                </div>
            </section>
        </div>
    )
}

export default KnowledgeContacts
