import React, { useMemo, useState } from 'react'
import { useBeeData } from '../context/BeeDataContext'

const HiveReview = () => {
    const { apiaries, hives, updateHive } = useBeeData()
    const [apiaryFilter, setApiaryFilter] = useState('')

    const displayedApiaries = useMemo(() => {
        return apiaries.filter((apiary) => (apiaryFilter ? apiary.id === apiaryFilter : true))
    }, [apiaries, apiaryFilter])

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Consultation des colonies</p>
                    <h3>Mettre à jour les ruches existantes</h3>
                    <p className="panel-caption">
                        Ajustez le statut, la population ou les repères clés sans mélanger ces actions avec la création.
                    </p>
                </div>
                <div className="filter-row">
                    <label className="filter">
                        Rucher
                        <select value={apiaryFilter} onChange={(event) => setApiaryFilter(event.target.value)}>
                            <option value="">Tous</option>
                            {apiaries.map((apiary) => (
                                <option key={apiary.id} value={apiary.id}>
                                    {apiary.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </header>

            <section className="panel">
                <div className="records-grid">
                    {displayedApiaries.map((apiary) => (
                        <article key={apiary.id} className="record-card">
                            <div className="record-card__header">
                                <div>
                                    <p className="eyebrow">{apiary.category}</p>
                                    <h4>{apiary.name}</h4>
                                </div>
                                <p className="muted">{apiary.location}</p>
                            </div>
                            <ul className="muted">
                                {hives
                                    .filter((hive) => hive.apiaryId === apiary.id)
                                    .map((hive) => (
                                        <li key={hive.id} className="record-line">
                                            <div>
                                                <strong>{hive.name}</strong> — {hive.type}
                                                <p className="muted">Reine {hive.queenYear}</p>
                                            </div>
                                            <div className="record-controls">
                                                <label htmlFor={`status-${hive.id}`}>Statut</label>
                                                <select
                                                    id={`status-${hive.id}`}
                                                    value={hive.status}
                                                    onChange={(event) => updateHive(hive.id, { status: event.target.value })}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="monitor">À surveiller</option>
                                                    <option value="archived">Archivée</option>
                                                </select>
                                                <label htmlFor={`pop-${hive.id}`}>Population</label>
                                                <select
                                                    id={`pop-${hive.id}`}
                                                    value={hive.population}
                                                    onChange={(event) => updateHive(hive.id, { population: event.target.value })}
                                                >
                                                    <option>Forte</option>
                                                    <option>Moyenne</option>
                                                    <option>À surveiller</option>
                                                </select>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </article>
                    ))}
                </div>
                {displayedApiaries.length === 0 && <p className="muted">Aucune ruche à afficher.</p>}
            </section>
        </div>
    )
}

export default HiveReview
