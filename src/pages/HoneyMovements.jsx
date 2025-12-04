import React, { useMemo, useState } from 'react'
import { useBeeData } from '../context/BeeDataContext'

const emptyMovement = {
    date: new Date().toISOString().slice(0, 10),
    lot: '',
    quantity: '',
    type: 'vente',
    destination: '',
    notes: '',
}

const HoneyMovements = () => {
    const { harvests, movements, addMovement } = useBeeData()
    const [form, setForm] = useState(emptyMovement)
    const [feedback, setFeedback] = useState('')

    const lotOptions = useMemo(
        () =>
            harvests.map((lot) => ({
                value: lot.lot || lot.id,
                label: `${lot.lot || 'Lot à renseigner'} (${lot.honeyType || 'Type non défini'})`,
            })),
        [harvests],
    )

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!form.lot || !form.quantity) return
        addMovement({ ...form, quantity: Number(form.quantity) })
        setFeedback('Mouvement enregistré')
        setForm(emptyMovement)
    }

    return (
        <div className="panel">
            <div className="panel-header">
                <div>
                    <p className="eyebrow">Mouvements de miel</p>
                    <h3>Suivre ventes, dons et utilisation</h3>
                    <p className="panel-caption">
                        Enregistrez chaque sortie ou utilisation pour garder une trace précise du stock.
                    </p>
                </div>
            </div>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Nouveau mouvement</p>
                        <h3>Détail de la sortie</h3>
                    </div>
                    <p className="panel-caption">Sélectionnez le lot concerné, le type de mouvement et la quantité.</p>
                </div>
                <form className="definition-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="date">Date</label>
                            <input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lot">Lot *</label>
                            <select id="lot" name="lot" value={form.lot} onChange={handleChange} required>
                                <option value="">Sélectionner</option>
                                {lotOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="type">Type *</label>
                            <select id="type" name="type" value={form.type} onChange={handleChange}>
                                <option value="vente">Vente</option>
                                <option value="don">Don</option>
                                <option value="utilisation">Utilisation</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="quantity">Quantité (kg) *</label>
                            <input
                                id="quantity"
                                name="quantity"
                                type="number"
                                inputMode="decimal"
                                value={form.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="destination">Destination ou client</label>
                            <input
                                id="destination"
                                name="destination"
                                type="text"
                                placeholder="Marché, AMAP, cuisine..."
                                value={form.destination}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows="3"
                            placeholder="Facture, lot conditionnement, référence"
                            value={form.notes}
                            onChange={handleChange}
                        />
                    </div>
                    {feedback && <div className="alert success">{feedback}</div>}
                    <button type="submit" className="btn-primary">
                        Enregistrer le mouvement
                    </button>
                </form>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Historique</p>
                        <h3>Tableau des sorties</h3>
                    </div>
                    <p className="panel-caption">Fil conducteur des ventes, dons et utilisations du stock de miel.</p>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Lot</th>
                                <th>Type</th>
                                <th>Quantité (kg)</th>
                                <th>Destination</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.map((movement) => (
                                <tr key={movement.id}>
                                    <td>{movement.date}</td>
                                    <td>{movement.lot}</td>
                                    <td>{movement.type}</td>
                                    <td>{movement.quantity}</td>
                                    <td>{movement.destination || '—'}</td>
                                    <td>{movement.notes || '—'}</td>
                                </tr>
                            ))}
                            {movements.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="muted">
                                        Aucun mouvement enregistré.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

export default HoneyMovements
