import React, { useMemo, useState } from 'react'
import { useBeeData } from '../context/BeeDataContext'

const emptyEquipment = {
    name: '',
    category: '',
    needed: '',
    inStock: '',
    note: '',
}

const Inventory = () => {
    const { equipment, addEquipment, updateEquipment, updateEquipmentStock } = useBeeData()
    const [form, setForm] = useState(emptyEquipment)
    const [feedback, setFeedback] = useState('')

    const groupedEquipment = useMemo(() => {
        return equipment.reduce((acc, item) => {
            const key = item.category || 'Non classé'
            acc[key] = acc[key] ? [...acc[key], item] : [item]
            return acc
        }, {})
    }, [equipment])

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
        setForm(emptyEquipment)
        setFeedback('Équipement ajouté à l’inventaire')
    }

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Inventaire</p>
                    <h3>Gestion du matériel apicole</h3>
                    <p className="panel-caption">
                        Visualisez le stock par catégorie, ajoutez du matériel et ajustez rapidement les quantités disponibles.
                    </p>
                </div>
            </header>

            <section className="panel">
                <form className="definition-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Intitulé *</label>
                            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Catégorie *</label>
                            <input id="category" name="category" type="text" value={form.category} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="needed">Besoin</label>
                            <input id="needed" name="needed" type="number" value={form.needed} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inStock">En stock</label>
                            <input id="inStock" name="inStock" type="number" value={form.inStock} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="note">Note</label>
                        <textarea id="note" name="note" rows="2" value={form.note} onChange={handleChange} />
                    </div>
                    {feedback && (
                        <div className="alert success" role="status">
                            {feedback}
                        </div>
                    )}
                    <button type="submit" className="btn-primary">
                        Ajouter à l’inventaire
                    </button>
                </form>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Stocks</p>
                        <h3>Consultation et ajustements</h3>
                    </div>
                    <p className="panel-caption">Regroupement automatique par catégorie de matériel.</p>
                </div>
                <div className="definition-grid">
                    {Object.entries(groupedEquipment).map(([category, items]) => (
                        <article key={category} className="definition-card">
                            <h4>{category}</h4>
                            <ul className="muted">
                                {items.map((item) => (
                                    <li key={item.id} className="inventory-line">
                                        <div>
                                            <strong>{item.name}</strong>
                                            <p className="muted">{item.note}</p>
                                        </div>
                                        <div className="inventory-controls">
                                            <label htmlFor={`needed-${item.id}`}>Besoin</label>
                                            <input
                                                id={`needed-${item.id}`}
                                                type="number"
                                                value={item.needed}
                                                onChange={(event) =>
                                                    updateEquipment(item.id, { needed: Number(event.target.value) })
                                                }
                                            />
                                            <label htmlFor={`stock-${item.id}`}>Stock</label>
                                            <input
                                                id={`stock-${item.id}`}
                                                type="number"
                                                value={item.inStock}
                                                onChange={(event) =>
                                                    updateEquipment(item.id, { inStock: Number(event.target.value) })
                                                }
                                            />
                                            <div className="pill-row">
                                                <button
                                                    type="button"
                                                    className="btn-ghost"
                                                    onClick={() => updateEquipmentStock(item.id, 1)}
                                                >
                                                    +1
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-ghost"
                                                    onClick={() => updateEquipmentStock(item.id, -1)}
                                                >
                                                    -1
                                                </button>
                                            </div>
                                        </div>
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

export default Inventory
