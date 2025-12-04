import React, { useMemo, useState } from 'react'
import { useBeeData } from '../context/BeeDataContext'

const defaultCategories = ['Rayons', 'Hausses', 'Nourrissement', 'Traitement', 'Conditionnement', 'Protection']

const emptyEquipment = {
    name: '',
    category: defaultCategories[0],
    needed: '',
    inStock: '',
    price: '',
    note: '',
    newCategory: '',
    comment: '',
}

const Inventory = () => {
    const { equipment, addEquipment, updateEquipment, updateEquipmentStock, movements, addMovement } = useBeeData()
    const [form, setForm] = useState(emptyEquipment)
    const [feedback, setFeedback] = useState('')
    const [movement, setMovement] = useState({ kind: 'Vente', label: '', quantity: 0, comment: '' })
    const [categories, setCategories] = useState(() => {
        const unique = new Set([...defaultCategories, ...equipment.map((item) => item.category)])
        return Array.from(unique)
    })

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
        const category = form.newCategory || form.category
        if (!form.name || !category) return
        if (form.newCategory && !categories.includes(form.newCategory)) {
            setCategories((prev) => [...prev, form.newCategory])
        }
        addEquipment({
            ...form,
            category,
            needed: form.needed ? Number(form.needed) : 0,
            inStock: form.inStock ? Number(form.inStock) : 0,
            price: form.price ? Number(form.price) : undefined,
            note: form.comment || form.note,
        })
        setForm({ ...emptyEquipment, category })
        setFeedback("Équipement ajouté à l’inventaire")
    }

    const handleMovementSubmit = (event) => {
        event.preventDefault()
        if (!movement.label || !movement.quantity) return
        addMovement(movement)
        setMovement({ kind: movement.kind, label: '', quantity: 0, comment: '' })
    }

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Inventaire</p>
                    <h3>Gestion du matériel apicole</h3>
                    <p className="panel-caption">
                        Visualisez le stock sous forme de tableau, ajoutez du matériel, des prix et suivez les mouvements.
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
                            <select id="category" name="category" value={form.category} onChange={handleChange}>
                                {categories.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="newCategory">Nouvelle catégorie</label>
                            <input
                                id="newCategory"
                                name="newCategory"
                                type="text"
                                value={form.newCategory}
                                onChange={handleChange}
                                placeholder="Saisir pour ajouter"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="needed">Besoin</label>
                            <input id="needed" name="needed" type="number" value={form.needed} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inStock">En stock</label>
                            <input id="inStock" name="inStock" type="number" value={form.inStock} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Prix unitaire (€)</label>
                            <input id="price" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="comment">Commentaire</label>
                        <textarea id="comment" name="comment" rows="2" value={form.comment} onChange={handleChange} />
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
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Catégorie</th>
                                <th>Équipement</th>
                                <th>Besoin</th>
                                <th>Stock</th>
                                <th>Prix (€)</th>
                                <th>Commentaire</th>
                                <th>Ajustements</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(groupedEquipment).map(([category, items]) =>
                                items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{category}</td>
                                        <td>
                                            <strong>{item.name}</strong>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.needed}
                                                onChange={(event) =>
                                                    updateEquipment(item.id, { needed: Number(event.target.value) })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.inStock}
                                                onChange={(event) =>
                                                    updateEquipment(item.id, { inStock: Number(event.target.value) })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.price ?? ''}
                                                onChange={(event) =>
                                                    updateEquipment(item.id, { price: Number(event.target.value) || 0 })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <textarea
                                                rows="2"
                                                value={item.note || ''}
                                                onChange={(event) => updateEquipment(item.id, { note: event.target.value })}
                                            />
                                        </td>
                                        <td>
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
                                        </td>
                                    </tr>
                                )),
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Mouvements</p>
                        <h3>Ventes, dons, prêts, destructions</h3>
                    </div>
                    <p className="panel-caption">
                        Historisez chaque sortie ou entrée pour suivre précisément le matériel et les pots de miel.
                    </p>
                </div>

                <form className="definition-form" onSubmit={handleMovementSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="kind">Type</label>
                            <select
                                id="kind"
                                name="kind"
                                value={movement.kind}
                                onChange={(event) => setMovement((prev) => ({ ...prev, kind: event.target.value }))}
                            >
                                <option>Vente</option>
                                <option>Don</option>
                                <option>Prêt</option>
                                <option>Destruction</option>
                                <option>Autre</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="label">Matériel ou lot</label>
                            <input
                                id="label"
                                name="label"
                                type="text"
                                value={movement.label}
                                onChange={(event) => setMovement((prev) => ({ ...prev, label: event.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="quantity">Quantité</label>
                            <input
                                id="quantity"
                                name="quantity"
                                type="number"
                                value={movement.quantity}
                                onChange={(event) =>
                                    setMovement((prev) => ({ ...prev, quantity: Number(event.target.value) }))
                                }
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="movement-comment">Commentaire</label>
                        <textarea
                            id="movement-comment"
                            name="comment"
                            rows="2"
                            value={movement.comment}
                            onChange={(event) => setMovement((prev) => ({ ...prev, comment: event.target.value }))}
                        />
                    </div>
                    <button type="submit" className="btn-primary">
                        Ajouter le mouvement
                    </button>
                </form>

                <div className="table-wrapper" style={{ marginTop: '1rem' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Libellé</th>
                                <th>Quantité</th>
                                <th>Commentaire</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.map((item) => (
                                <tr key={item.id}>
                                    <td>{new Date(item.date).toLocaleDateString('fr-FR')}</td>
                                    <td>{item.kind}</td>
                                    <td>{item.label}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.comment}</td>
                                </tr>
                            ))}
                            {movements.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="muted">
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

export default Inventory
