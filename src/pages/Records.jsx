import React from 'react'
import { useBeeData } from '../context/BeeDataContext'

const Records = () => {
    const {
        apiaries,
        hives,
        visits,
        harvests,
        equipment,
        updateApiary,
        updateHive,
        updateVisit,
        updateHarvest,
        updateEquipment,
    } = useBeeData()

    const groupedApiaries = apiaries.reduce((acc, item) => {
        const key = item.category || 'Non classé'
        acc[key] = acc[key] ? [...acc[key], item] : [item]
        return acc
    }, {})

    const groupedVisits = visits.reduce((acc, visit) => {
        const apiaryKey = visit.apiaryId || 'hors-rucher'
        acc[apiaryKey] = acc[apiaryKey] ? [...acc[apiaryKey], visit] : [visit]
        return acc
    }, {})

    const groupedHarvests = harvests.reduce((acc, harvest) => {
        const key = harvest.honeyType || 'Non renseigné'
        acc[key] = acc[key] ? [...acc[key], harvest] : [harvest]
        return acc
    }, {})

    return (
        <div className="records-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Consultation</p>
                    <h3>Consulter et modifier les objets</h3>
                    <p className="panel-caption">
                        Tous vos ruchers, ruches, visites, récoltes et matériel regroupés par catégorie pour des mises à jour
                        rapides.
                    </p>
                </div>
            </header>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Ruchers</p>
                        <h3>Regroupés par catégorie</h3>
                    </div>
                    <p className="panel-caption">Modifiez les objectifs ou notes directement.</p>
                </div>
                <div className="definition-grid">
                    {Object.entries(groupedApiaries).map(([category, list]) => (
                        <article key={category} className="definition-card">
                            <h4>{category}</h4>
                            <ul className="muted">
                                {list.map((apiary) => (
                                    <li key={apiary.id} className="record-line">
                                        <div>
                                            <strong>{apiary.name}</strong>
                                            <p className="muted">{apiary.location}</p>
                                        </div>
                                        <div className="record-controls">
                                            <label htmlFor={`objectives-${apiary.id}`}>Objectifs</label>
                                            <input
                                                id={`objectives-${apiary.id}`}
                                                type="text"
                                                value={apiary.objectives}
                                                onChange={(event) =>
                                                    updateApiary(apiary.id, { objectives: event.target.value })
                                                }
                                            />
                                            <label htmlFor={`notes-${apiary.id}`}>Notes</label>
                                            <textarea
                                                id={`notes-${apiary.id}`}
                                                rows="2"
                                                value={apiary.notes}
                                                onChange={(event) => updateApiary(apiary.id, { notes: event.target.value })}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Ruches</p>
                        <h3>Consultation par rucher</h3>
                    </div>
                    <p className="panel-caption">Ajustez le statut et la population sans quitter la page.</p>
                </div>
                <div className="records-grid">
                    {apiaries.map((apiary) => (
                        <article key={apiary.id} className="record-card">
                            <div className="record-card__header">
                                <div>
                                    <p className="eyebrow">{apiary.category}</p>
                                    <h4>{apiary.name}</h4>
                                </div>
                                <p className="muted">{apiary.location}</p>
                            </div>
                            <ul className="muted">
                                {hives
                                    .filter((hive) => hive.apiaryId === apiary.id)
                                    .map((hive) => (
                                        <li key={hive.id} className="record-line">
                                            <div>
                                                <strong>{hive.name}</strong> — {hive.type}
                                                <p className="muted">Reine {hive.queenYear}</p>
                                            </div>
                                            <div className="record-controls">
                                                <label htmlFor={`status-${hive.id}`}>Statut</label>
                                                <select
                                                    id={`status-${hive.id}`}
                                                    value={hive.status}
                                                    onChange={(event) =>
                                                        updateHive(hive.id, { status: event.target.value })
                                                    }
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="monitor">À surveiller</option>
                                                    <option value="archived">Archivée</option>
                                                </select>
                                                <label htmlFor={`pop-${hive.id}`}>Population</label>
                                                <select
                                                    id={`pop-${hive.id}`}
                                                    value={hive.population}
                                                    onChange={(event) =>
                                                        updateHive(hive.id, { population: event.target.value })
                                                    }
                                                >
                                                    <option>Forte</option>
                                                    <option>Moyenne</option>
                                                    <option>À surveiller</option>
                                                </select>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Visites et récoltes</p>
                        <h3>Regroupement par rucher et type</h3>
                    </div>
                    <p className="panel-caption">Consultez les notes et mettez à jour poids ou volumes récoltés.</p>
                </div>
                <div className="records-grid">
                    {Object.entries(groupedVisits).map(([apiaryId, visitList]) => {
                        const apiary = apiaries.find((item) => item.id === apiaryId)
                        return (
                            <article key={apiaryId} className="record-card">
                                <div className="record-card__header">
                                    <h4>{apiary?.name || 'Rucher non renseigné'}</h4>
                                    <p className="muted">{visitList.length} visites</p>
                                </div>
                                <ul className="muted">
                                    {visitList.map((visit) => {
                                        const hive = hives.find((item) => item.id === visit.hiveId)
                                        return (
                                            <li key={visit.id} className="record-line">
                                                <div>
                                                    <strong>{new Date(visit.date).toLocaleDateString('fr-FR')}</strong> —
                                                    {` ${hive?.name || 'Ruche'} (${visit.weight} kg)`}
                                                </div>
                                                <div className="record-controls">
                                                    <label htmlFor={`weight-${visit.id}`}>Poids</label>
                                                    <input
                                                        id={`weight-${visit.id}`}
                                                        type="number"
                                                        value={visit.weight}
                                                        onChange={(event) =>
                                                            updateVisit(visit.id, { weight: Number(event.target.value) })
                                                        }
                                                    />
                                                    <label htmlFor={`notes-${visit.id}`}>Notes</label>
                                                    <textarea
                                                        id={`notes-${visit.id}`}
                                                        rows="2"
                                                        value={visit.notes}
                                                        onChange={(event) =>
                                                            updateVisit(visit.id, { notes: event.target.value })
                                                        }
                                                    />
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </article>
                        )
                    })}
                </div>
                <div className="records-grid">
                    {Object.entries(groupedHarvests).map(([type, list]) => (
                        <article key={type} className="record-card">
                            <div className="record-card__header">
                                <h4>{type}</h4>
                                <p className="muted">{list.length} lots</p>
                            </div>
                            <ul className="muted">
                                {list.map((harvest) => (
                                    <li key={harvest.id} className="record-line">
                                        <div>
                                            <strong>{harvest.lot || 'Lot à renseigner'}</strong> —
                                            {` ${harvest.quantityKg} kg`}
                                            <p className="muted">{new Date(harvest.date).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                        <div className="record-controls">
                                            <label htmlFor={`quantity-${harvest.id}`}>Quantité</label>
                                            <input
                                                id={`quantity-${harvest.id}`}
                                                type="number"
                                                value={harvest.quantityKg}
                                                onChange={(event) =>
                                                    updateHarvest(harvest.id, { quantityKg: Number(event.target.value) })
                                                }
                                            />
                                            <label htmlFor={`lot-${harvest.id}`}>Lot</label>
                                            <input
                                                id={`lot-${harvest.id}`}
                                                type="text"
                                                value={harvest.lot}
                                                onChange={(event) => updateHarvest(harvest.id, { lot: event.target.value })}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Matériel</p>
                        <h3>Regroupé par catégorie</h3>
                    </div>
                    <p className="panel-caption">Mettez à jour rapidement les besoins et stocks.</p>
                </div>
                <div className="definition-grid">
                    {Object.entries(
                        equipment.reduce((acc, item) => {
                            const key = item.category || 'Non classé'
                            acc[key] = acc[key] ? [...acc[key], item] : [item]
                            return acc
                        }, {}),
                    ).map(([category, items]) => (
                        <article key={category} className="definition-card">
                            <h4>{category}</h4>
                            <ul className="muted">
                                {items.map((item) => (
                                    <li key={item.id} className="record-line">
                                        <div>
                                            <strong>{item.name}</strong>
                                            <p className="muted">{item.note}</p>
                                        </div>
                                        <div className="record-controls">
                                            <label htmlFor={`need-${item.id}`}>Besoin</label>
                                            <input
                                                id={`need-${item.id}`}
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

export default Records
