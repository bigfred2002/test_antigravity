import React, { useState } from 'react'
import { useBeeData } from '../context/BeeDataContext'

const initialForm = {
    name: '',
    category: '',
    needed: '',
    inStock: '',
    note: '',
}

const EquipmentEntry = () => {
    const { addEquipment } = useBeeData()
    const [form, setForm] = useState(initialForm)
    const [message, setMessage] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!form.name || !form.category) return

        addEquipment({
            ...form,
            needed: form.needed ? Number(form.needed) : 0,
            inStock: form.inStock ? Number(form.inStock) : 0,
        })

        setForm(initialForm)
        setMessage('Matériel enregistré dans la base de données locale.')
    }

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Matériel apicole</p>
                    <h3>Saisie du matériel</h3>
                    <p className="panel-caption">
                        Renseignez le matériel dès son arrivée pour conserver une trace centralisée et persistante.
                    </p>
                </div>
            </header>

            <section className="panel">
                <form className="definition-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Intitulé *</label>
                            <input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                type="text"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Catégorie *</label>
                            <input
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                type="text"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="needed">Besoin estimé</label>
                            <input id="needed" name="needed" value={form.needed} onChange={handleChange} type="number" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inStock">Quantité reçue</label>
                            <input id="inStock" name="inStock" value={form.inStock} onChange={handleChange} type="number" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="note">Notes (référence fournisseur, état...)</label>
                        <textarea id="note" name="note" rows="3" value={form.note} onChange={handleChange} />
                    </div>
                    {message && (
                        <div className="alert success" role="status">
                            {message}
                        </div>
                    )}
                    <button type="submit" className="btn-primary">
                        Sauvegarder
                    </button>
                </form>
            </section>
        </div>
    )
}

export default EquipmentEntry
