import React from 'react'
import { ExternalLink } from 'lucide-react'
import { useBeeData } from '../context/BeeDataContext'

const KnowledgeSites = () => {
    const { knowledge } = useBeeData()

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Base de connaissance</p>
                    <h3>Sites et liens utiles</h3>
                    <p className="panel-caption">
                        Rassemblez les ressources en ligne pour suivre la météo, les floraisons ou les guides pratiques.
                    </p>
                </div>
                <div className="pill">{knowledge.sites.length} site(s)</div>
            </header>

            <section className="panel">
                <div className="definition-grid">
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Liens enregistrés</h4>
                            <ExternalLink size={18} />
                        </div>
                        <ul className="muted">
                            {knowledge.sites.map((site) => (
                                <li key={site.id} className="record-line">
                                    <div>
                                        <strong>{site.label}</strong>
                                        <p className="muted">{site.url}</p>
                                    </div>
                                    <a href={site.url} target="_blank" rel="noreferrer" className="pill">
                                        Ouvrir
                                    </a>
                                </li>
                            ))}
                        </ul>
                        {!knowledge.sites.length && <p className="muted">Aucun site ajouté pour le moment.</p>}
                    </article>
                </div>
            </section>
        </div>
    )
}

export default KnowledgeSites
