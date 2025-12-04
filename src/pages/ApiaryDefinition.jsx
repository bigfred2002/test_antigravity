import React, { useEffect, useState } from 'react'
import { useBeeData } from '../context/BeeDataContext'

const ApiaryDefinition = () => {
    const { apiary, updateApiary } = useBeeData()
    const [form, setForm] = useState(apiary)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        setForm(apiary)
    }, [apiary])

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
        setSaved(false)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        updateApiary(form)
        setSaved(true)
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
            </header>

            <section className="panel">
                <form className="definition-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Nom du rucher</label>
                            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} />
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
                        Enregistrer les infos rucher
                    </button>
                </form>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Synthèse rapide</p>
                        <h3>Repères clés</h3>
                    </div>
                    <p className="panel-caption">Une vue condensée pour briefer les intervenants et visiteurs.</p>
                </div>
                <div className="definition-grid">
                    <article className="definition-card">
                        <h4>Site</h4>
                        <p>{form.location}</p>
                        <p className="muted">{form.altitude}</p>
                    </article>
                    <article className="definition-card">
                        <h4>Flore</h4>
                        <p>{form.flora}</p>
                        <p className="muted">Miellées cibles et pollen disponible</p>
                    </article>
                    <article className="definition-card">
                        <h4>Objectif</h4>
                        <p>{form.objectives}</p>
                        <p className="muted">Production, élevage ou pollinisation</p>
                    </article>
                    <article className="definition-card">
                        <h4>Conditions</h4>
                        <p>{form.notes}</p>
                        <p className="muted">Accès, météo, voisinage</p>
                    </article>
                </div>
            </section>
        </div>
    )
}

export default ApiaryDefinition
