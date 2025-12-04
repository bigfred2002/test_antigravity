import React, { useState } from 'react'
import { ExternalLink, Link2 } from 'lucide-react'
import { useBeeData } from '../context/BeeDataContext'

const SiteManager = () => {
    const { knowledge, updateKnowledge } = useBeeData()
    const [site, setSite] = useState({ label: '', url: '' })

    const addSite = (event) => {
        event.preventDefault()
        if (!site.label || !site.url) return
        updateKnowledge('sites', (prev) => [...prev, { ...site, id: `site-${Date.now()}` }])
        setSite({ label: '', url: '' })
    }

    const removeSite = (id) => {
        updateKnowledge('sites', (prev) => prev.filter((item) => item.id !== id))
    }

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Administration · Base de connaissance</p>
                    <h3>Gestion des sites web</h3>
                    <p className="panel-caption">Ajoutez vos liens de référence : météo, ressources techniques ou forums.</p>
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
                            {knowledge.sites.map((item) => (
                                <li key={item.id} className="record-line">
                                    <div>
                                        <strong>{item.label}</strong>
                                        <p className="muted">{item.url}</p>
                                    </div>
                                    <button type="button" className="btn-ghost" onClick={() => removeSite(item.id)}>
                                        Retirer
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {!knowledge.sites.length && <p className="muted">Aucun lien sauvegardé pour le moment.</p>}
                    </article>

                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Ajouter un site</h4>
                            <Link2 size={18} />
                        </div>
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
                                Enregistrer
                            </button>
                        </form>
                    </article>
                </div>
            </section>
        </div>
    )
}

export default SiteManager
