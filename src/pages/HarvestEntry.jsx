import React, { useMemo, useState } from 'react'
import { useBeeData } from '../context/BeeDataContext'

const emptyHarvest = {
    date: '',
    apiaryId: '',
    hiveId: '',
    honeyType: '',
    lot: '',
    quantityKg: '',
    humidity: '',
    notes: '',
    jarred: false,
    jarNotes: '',
}

const HarvestEntry = () => {
    const { apiaries, hives, harvests, addHarvest } = useBeeData()
    const [form, setForm] = useState(emptyHarvest)
    const [feedback, setFeedback] = useState('')

    const apiaryOptions = useMemo(() => apiaries.map((apiary) => ({ value: apiary.id, label: apiary.name })), [apiaries])
    const hiveOptions = useMemo(() => {
        if (!form.apiaryId) return []
        return hives
            .filter((hive) => hive.apiaryId === form.apiaryId)
            .map((hive) => ({ value: hive.id, label: hive.name }))
    }, [form.apiaryId, hives])

    const groupedHarvests = useMemo(() => {
        return harvests.reduce((acc, item) => {
            const key = item.honeyType || 'Non renseigné'
            acc[key] = acc[key] ? [...acc[key], item] : [item]
            return acc
        }, {})
    }, [harvests])

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value, ...(name === 'apiaryId' ? { hiveId: '' } : null) }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!form.apiaryId || !form.hiveId || !form.date || !form.honeyType) return
        addHarvest({
            ...form,
            quantityKg: Number(form.quantityKg),
            humidity: form.humidity ? Number(form.humidity) : undefined,
            jarred: Boolean(form.jarred),
        })
        setFeedback('Récolte enregistrée')
        setForm(emptyHarvest)
    }

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Récoltes</p>
                    <h3>Consigner une récolte de miel</h3>
                    <p className="panel-caption">
                        Sélectionnez le rucher et la ruche concernée puis notez le lot, la masse récoltée et le taux d’humidité.
                    </p>
                </div>
            </header>

            <section className="panel">
                <form className="definition-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="date">Date *</label>
                            <input id="date" name="date" type="date" value={form.date} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="apiaryId">Rucher *</label>
                            <select id="apiaryId" name="apiaryId" value={form.apiaryId} onChange={handleChange} required>
                                <option value="">Sélectionner</option>
                                {apiaryOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="hiveId">Ruche *</label>
                            <select id="hiveId" name="hiveId" value={form.hiveId} onChange={handleChange} required>
                                <option value="">Sélectionner</option>
                                {hiveOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="honeyType">Type de miel *</label>
                            <input
                                id="honeyType"
                                name="honeyType"
                                type="text"
                                placeholder="Montagne, Forêt, Acacia..."
                                value={form.honeyType}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lot">Lot</label>
                            <input
                                id="lot"
                                name="lot"
                                type="text"
                                placeholder="Numéro de lot"
                                value={form.lot}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="quantityKg">Quantité (kg)</label>
                            <input
                                id="quantityKg"
                                name="quantityKg"
                                type="number"
                                inputMode="decimal"
                                value={form.quantityKg}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="humidity">Humidité (%)</label>
                            <input
                                id="humidity"
                                name="humidity"
                                type="number"
                                step="0.1"
                                inputMode="decimal"
                                value={form.humidity}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="jarred">Mise en pots</label>
                            <select
                                id="jarred"
                                name="jarred"
                                value={form.jarred ? 'oui' : 'non'}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, jarred: event.target.value === 'oui' }))
                                }
                            >
                                <option value="non">À planifier</option>
                                <option value="oui">Réalisée</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows="3"
                            placeholder="Filtration, maturateur, observations..."
                            value={form.notes}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="jarNotes">Détails mise en pots</label>
                        <textarea
                            id="jarNotes"
                            name="jarNotes"
                            rows="2"
                            placeholder="Nombre de pots, format, capsules, planning..."
                            value={form.jarNotes}
                            onChange={handleChange}
                        />
                    </div>

                    {feedback && (
                        <div className="alert success" role="status">
                            {feedback}
                        </div>
                    )}

                    <button type="submit" className="btn-primary">
                        Enregistrer la récolte
                    </button>
                </form>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Lots existants</p>
                        <h3>Consultation et modifications</h3>
                    </div>
                    <p className="panel-caption">Classement automatique par type de miel.</p>
                </div>
                <div className="definition-grid">
                    {Object.entries(groupedHarvests).map(([type, list]) => (
                        <article key={type} className="definition-card">
                            <h4>{type}</h4>
                            <ul className="muted">
                                {list.map((item) => {
                                    const hive = hives.find((hiveItem) => hiveItem.id === item.hiveId)
                                    const apiary = apiaries.find((apiaryItem) => apiaryItem.id === item.apiaryId)
                                    return (
                                        <li key={item.id}>
                                            {new Date(item.date).toLocaleDateString('fr-FR')} · {apiary?.name} / {hive?.name} –
                                            {` ${item.quantityKg} kg`} ({item.lot || 'Lot à renseigner'})
                                            <div className="muted">
                                                Mise en pots : {item.jarred ? 'Réalisée' : 'À planifier'}
                                                {item.jarNotes ? ` — ${item.jarNotes}` : ''}
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default HarvestEntry
