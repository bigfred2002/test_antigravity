import React, { useMemo, useState } from 'react'
import { useBeeData } from '../context/BeeDataContext'

const emptyHive = {
    apiaryId: '',
    name: '',
    type: 'Dadant 10 cadres',
    queenYear: new Date().getFullYear(),
    origin: '',
    population: 'Moyenne',
}

const statusLabels = {
    active: 'Active',
    monitor: 'À surveiller',
    archived: 'Archivée',
}

const HiveDefinition = () => {
    const { apiaries, hives, addHive } = useBeeData()
    const [form, setForm] = useState({ ...emptyHive, apiaryId: apiaries[0]?.id || '' })
    const [feedback, setFeedback] = useState('')

    const groupedHives = useMemo(() => {
        return apiaries
            .map((apiary) => ({
                apiary,
                hives: hives.filter((hive) => hive.apiaryId === apiary.id),
            }))
            .filter((group) => group.hives.length > 0)
    }, [apiaries, hives])

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!form.name) return
        addHive({ ...form, status: 'active' })
        setFeedback('Ruche ajoutée à la liste.')
        setForm({ ...emptyHive, apiaryId: apiaries[0]?.id || '' })
    }

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Ruches</p>
                    <h3>Définition des colonies</h3>
                    <p className="panel-caption">
                        Ajoutez les caractéristiques principales de vos ruches : format, année de reine, provenance et état de la
                        colonie.
                    </p>
                </div>
            </header>

            <section className="panel">
                <form className="definition-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="apiaryId">Rucher *</label>
                            <select id="apiaryId" name="apiaryId" value={form.apiaryId} onChange={handleChange} required>
                                {apiaries.map((apiary) => (
                                    <option key={apiary.id} value={apiary.id}>
                                        {apiary.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Nom de la ruche *</label>
                            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="type">Format</label>
                            <select id="type" name="type" value={form.type} onChange={handleChange}>
                                <option>Dadant 10 cadres</option>
                                <option>Dadant 12 cadres</option>
                                <option>Warré</option>
                                <option>Langstroth</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="queenYear">Année de la reine</label>
                            <input
                                id="queenYear"
                                name="queenYear"
                                type="number"
                                min="2015"
                                max={new Date().getFullYear()}
                                value={form.queenYear}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="origin">Provenance</label>
                            <input
                                id="origin"
                                name="origin"
                                type="text"
                                value={form.origin}
                                onChange={handleChange}
                                placeholder="Essaim naturel, achat, division..."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="population">Population</label>
                            <select id="population" name="population" value={form.population} onChange={handleChange}>
                                <option>Forte</option>
                                <option>Moyenne</option>
                                <option>À surveiller</option>
                            </select>
                        </div>
                    </div>

                    {feedback && (
                        <div className="alert success" role="status">
                            {feedback}
                        </div>
                    )}

                    <button type="submit" className="btn-primary">
                        Ajouter la ruche
                    </button>
                </form>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Inventaire ruches</p>
                        <h3>{hives.length} ruches référencées</h3>
                    </div>
                    <p className="panel-caption">Une vue rapide pour préparer vos visites et répartir le matériel.</p>
                </div>
                {groupedHives.map((group) => (
                    <div key={group.apiary.id} className="hive-category">
                        <div className="panel-header">
                            <div>
                                <p className="eyebrow">{group.apiary.category}</p>
                                <h4>{group.apiary.name}</h4>
                            </div>
                            <p className="panel-caption">{group.apiary.location}</p>
                        </div>
                        <div className="hive-grid">
                            {group.hives.map((hive) => (
                                <article key={hive.id} className={`hive-card ${hive.status}`} aria-label={hive.name}>
                                    <div className="hive-card__header">
                                        <div>
                                            <p className="eyebrow">{statusLabels[hive.status] || 'Active'}</p>
                                            <h4>{hive.name}</h4>
                                        </div>
                                        <span className="pill">{hive.population}</span>
                                    </div>
                                    <div className="hive-card__body">
                                        <p>
                                            <strong>Format :</strong> {hive.type}
                                        </p>
                                        <p>
                                            <strong>Reine :</strong> {hive.queenYear}
                                        </p>
                                        <p>
                                            <strong>Origine :</strong> {hive.origin}
                                        </p>
                                        <p>
                                            <strong>Statut :</strong> {statusLabels[hive.status] || 'Active'}
                                        </p>
                                        <p>
                                            <strong>Population :</strong> {hive.population}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    )
}

export default HiveDefinition
