import React, { useEffect, useMemo, useState } from 'react'
import { useBeeData } from '../context/BeeDataContext'

const emptyApiary = {
    name: '',
    location: '',
    altitude: '',
    flora: '',
    objectives: '',
    notes: '',
    category: 'Non classé',
}

const ApiaryDefinition = () => {
    const { apiaries, addApiary, updateApiary } = useBeeData()
    const [selectedApiaryId, setSelectedApiaryId] = useState(apiaries[0]?.id || '')
    const [form, setForm] = useState(apiaries[0] || emptyApiary)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        if (!selectedApiaryId) {
            setForm(emptyApiary)
            return
        }
        const current = apiaries.find((item) => item.id === selectedApiaryId)
        setForm(current || emptyApiary)
    }, [apiaries, selectedApiaryId])

    const categories = useMemo(() => {
        return apiaries.reduce((acc, apiary) => {
            const key = apiary.category || 'Non classé'
            acc[key] = acc[key] ? [...acc[key], apiary] : [apiary]
            return acc
        }, {})
    }, [apiaries])

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
        setSaved(false)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (selectedApiaryId) {
            updateApiary(selectedApiaryId, form)
        } else {
            const created = addApiary(form)
            setSelectedApiaryId(created.id)
        }
        setSaved(true)
    }

    const startNewApiary = () => {
        setSelectedApiaryId('')
        setForm(emptyApiary)
        setSaved(false)
    }

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Rucher</p>
                    <h3>Fiche d'identité du rucher</h3>
                    <p className="panel-caption">
                        Renseignez l’emplacement, les ressources florales et les objectifs du rucher pour mieux préparer vos
                        visites et transhumances.
                    </p>
                </div>
                <div className="pill-row">
                    <label htmlFor="apiary-select" className="muted">
                        Choisir un rucher
                    </label>
                    <select
                        id="apiary-select"
                        value={selectedApiaryId}
                        onChange={(e) => setSelectedApiaryId(e.target.value)}
                        className="pill"
                    >
                        {apiaries.map((apiary) => (
                            <option key={apiary.id} value={apiary.id}>
                                {apiary.name}
                            </option>
                        ))}
                        <option value="">+ Nouveau rucher</option>
                    </select>
                    <button type="button" className="btn-ghost" onClick={startNewApiary}>
                        Créer un nouveau rucher
                    </button>
                </div>
            </header>

            <section className="panel">
                <form className="definition-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Nom du rucher</label>
                            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Localisation</label>
                            <input id="location" name="location" type="text" value={form.location} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="altitude">Altitude</label>
                            <input id="altitude" name="altitude" type="text" value={form.altitude} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="flora">Floraison dominante</label>
                            <input id="flora" name="flora" type="text" value={form.flora} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Catégorie</label>
                            <input id="category" name="category" type="text" value={form.category} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="objectives">Objectifs</label>
                        <textarea
                            id="objectives"
                            name="objectives"
                            rows="3"
                            value={form.objectives}
                            onChange={handleChange}
                            placeholder="Production, élevage de reines, pollinisation locale..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes">Conditions et accès</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows="3"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Orientation, abri, point d’eau, accès véhicule..."
                        />
                    </div>

                    {saved && (
                        <div className="alert success" role="status">
                            Fiche rucher mise à jour.
                        </div>
                    )}

                    <button type="submit" className="btn-primary">
                        {selectedApiaryId ? 'Mettre à jour le rucher' : 'Enregistrer ce nouveau rucher'}
                    </button>
                </form>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Synthèse rapide</p>
                        <h3>Repères clés par catégorie</h3>
                    </div>
                    <p className="panel-caption">Une vue condensée pour briefer les intervenants et visiteurs.</p>
                </div>
                <div className="definition-grid">
                    {Object.entries(categories).map(([category, items]) => (
                        <article key={category} className="definition-card">
                            <h4>{category}</h4>
                            <ul className="muted">
                                {items.map((item) => (
                                    <li key={item.id}>
                                        <strong>{item.name}</strong> · {item.location} — {item.flora}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default ApiaryDefinition
