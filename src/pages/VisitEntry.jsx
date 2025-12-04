import React, { useMemo, useState } from 'react'
import { useBeeData } from '../context/BeeDataContext'

const initialForm = {
    date: '',
    hiveId: '',
    weight: '',
    colonyStrength: 'Moyenne',
    broodPattern: '',
    weather: '',
    notes: '',
    treatment: '',
    honeySupers: 'non',
}

const VisitEntry = () => {
    const { hives, addVisit, status, error, resetStatus } = useBeeData()
    const [form, setForm] = useState(initialForm)
    const [formError, setFormError] = useState({})
    const [submitted, setSubmitted] = useState(false)

    const hiveOptions = useMemo(() => hives.map((hive) => ({ value: hive.id, label: hive.name })), [hives])

    const validate = () => {
        const nextErrors = {}
        if (!form.date) nextErrors.date = 'Sélectionnez une date.'
        if (!form.hiveId) nextErrors.hiveId = 'Choisissez une ruche.'
        if (!form.weight) nextErrors.weight = 'Indiquez le poids.'
        if (form.weight && Number.isNaN(Number(form.weight))) nextErrors.weight = 'Le poids doit être numérique.'
        if (!form.broodPattern) nextErrors.broodPattern = 'Décrivez le couvain.'
        if (!form.weather) nextErrors.weather = 'Précisez la météo.'
        return nextErrors
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
        if (formError[name]) {
            setFormError((prev) => ({ ...prev, [name]: undefined }))
        }
        if (submitted) {
            resetStatus()
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const nextErrors = validate()
        setFormError(nextErrors)
        if (Object.keys(nextErrors).length > 0) return

        addVisit({
            ...form,
            weight: Number(form.weight),
            date: form.date,
        })
        setSubmitted(true)
        setForm(initialForm)
    }

    return (
        <div className="visit-entry" aria-labelledby="visit-title">
            <div className="panel-header">
                <div>
                    <p className="eyebrow">Nouvelle inspection</p>
                    <h3 id="visit-title">Consigner votre visite</h3>
                    <p className="panel-caption">
                        Ajoutez les repères clés : poids, météo, couvain et ressentis pour suivre l’évolution des colonies.
                    </p>
                </div>
            </div>

            <form className="visit-form" onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="date">Date de visite *</label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={handleChange}
                            aria-invalid={Boolean(formError.date)}
                            aria-describedby={formError.date ? 'date-error' : undefined}
                        />
                        {formError.date && (
                            <p id="date-error" className="error-text">
                                {formError.date}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="hiveId">Ruche *</label>
                        <select
                            id="hiveId"
                            name="hiveId"
                            value={form.hiveId}
                            onChange={handleChange}
                            aria-invalid={Boolean(formError.hiveId)}
                            aria-describedby={formError.hiveId ? 'hive-error' : undefined}
                        >
                            <option value="">Sélectionner</option>
                            {hiveOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {formError.hiveId && (
                            <p id="hive-error" className="error-text">
                                {formError.hiveId}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="weight">Poids (kg) *</label>
                        <input
                            id="weight"
                            name="weight"
                            type="number"
                            inputMode="decimal"
                            value={form.weight}
                            onChange={handleChange}
                            aria-invalid={Boolean(formError.weight)}
                            aria-describedby={formError.weight ? 'weight-error' : undefined}
                        />
                        {formError.weight && (
                            <p id="weight-error" className="error-text">
                                {formError.weight}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="colonyStrength">Force de la colonie</label>
                        <select
                            id="colonyStrength"
                            name="colonyStrength"
                            value={form.colonyStrength}
                            onChange={handleChange}
                        >
                            <option value="Forte">Forte</option>
                            <option value="Moyenne">Moyenne</option>
                            <option value="À surveiller">À surveiller</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="broodPattern">Couvain *</label>
                        <input
                            id="broodPattern"
                            name="broodPattern"
                            type="text"
                            placeholder="Compact, régulier, clairsemé..."
                            value={form.broodPattern}
                            onChange={handleChange}
                            aria-invalid={Boolean(formError.broodPattern)}
                            aria-describedby={formError.broodPattern ? 'brood-error' : undefined}
                        />
                        {formError.broodPattern && (
                            <p id="brood-error" className="error-text">
                                {formError.broodPattern}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="weather">Météo *</label>
                        <input
                            id="weather"
                            name="weather"
                            type="text"
                            placeholder="Ensoleillé, couvert, vent léger..."
                            value={form.weather}
                            onChange={handleChange}
                            aria-invalid={Boolean(formError.weather)}
                            aria-describedby={formError.weather ? 'weather-error' : undefined}
                        />
                        {formError.weather && (
                            <p id="weather-error" className="error-text">
                                {formError.weather}
                            </p>
                        )}
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="treatment">Traitement ou nourrissement</label>
                        <input
                            id="treatment"
                            name="treatment"
                            type="text"
                            placeholder="Sirop, candi, acide formique..."
                            value={form.treatment}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="honeySupers">Hausses en place</label>
                        <select id="honeySupers" name="honeySupers" value={form.honeySupers} onChange={handleChange}>
                            <option value="oui">Oui</option>
                            <option value="non">Non</option>
                            <option value="prévu">Pose prévue</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Notes et observations</label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows="4"
                        placeholder="Comportement, floraisons voisines, vigilance essaimage..."
                        value={form.notes}
                        onChange={handleChange}
                    />
                </div>

                {status === 'success' && submitted && (
                    <div className="alert success" role="status">
                        La visite a été ajoutée au tableau de bord.
                    </div>
                )}
                {status === 'error' && error && (
                    <div className="alert error" role="alert">
                        {error}
                    </div>
                )}

                <button type="submit" className="btn-primary">
                    {status === 'loading' ? 'Enregistrement...' : 'Enregistrer la visite'}
                </button>
            </form>
        </div>
    )
}

export default VisitEntry
