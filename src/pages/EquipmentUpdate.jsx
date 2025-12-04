import React from 'react'
import { useBeeData } from '../context/BeeDataContext'

const EquipmentUpdate = () => {
    const { equipment, updateEquipment, updateEquipmentStock } = useBeeData()

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Matériel apicole</p>
                    <h3>Modification et ajustements</h3>
                    <p className="panel-caption">
                        Corrigez les quantités, renommez un élément ou reclasser vos équipements sans quitter la base de données.
                    </p>
                </div>
            </header>

            <section className="panel">
                <div className="definition-grid">
                    {equipment.map((item) => (
                        <article key={item.id} className="definition-card">
                            <div className="card-header">
                                <h4>{item.name}</h4>
                                <p className="muted">{item.category || 'Non catégorisé'}</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor={`name-${item.id}`}>Nom</label>
                                <input
                                    id={`name-${item.id}`}
                                    type="text"
                                    value={item.name}
                                    onChange={(event) => updateEquipment(item.id, { name: event.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor={`category-${item.id}`}>Catégorie</label>
                                <input
                                    id={`category-${item.id}`}
                                    type="text"
                                    value={item.category}
                                    onChange={(event) => updateEquipment(item.id, { category: event.target.value })}
                                />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor={`needed-${item.id}`}>Besoin</label>
                                    <input
                                        id={`needed-${item.id}`}
                                        type="number"
                                        value={item.needed}
                                        onChange={(event) =>
                                            updateEquipment(item.id, { needed: Number(event.target.value) })
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`stock-${item.id}`}>Stock</label>
                                    <input
                                        id={`stock-${item.id}`}
                                        type="number"
                                        value={item.inStock}
                                        onChange={(event) =>
                                            updateEquipment(item.id, { inStock: Number(event.target.value) })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="pill-row">
                                <button
                                    type="button"
                                    className="btn-ghost"
                                    onClick={() => updateEquipmentStock(item.id, 1)}
                                >
                                    +1 stock
                                </button>
                                <button
                                    type="button"
                                    className="btn-ghost"
                                    onClick={() => updateEquipmentStock(item.id, -1)}
                                >
                                    -1 stock
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default EquipmentUpdate
