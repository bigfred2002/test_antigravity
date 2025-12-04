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

    return (
        <div className="records-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Résumé rucher</p>
                    <h3>Consulter et modifier d'un coup d'œil</h3>
                    <p className="panel-caption">Des tableaux lisibles pour piloter ruchers, ruches, visites, lots et matériel.</p>
                </div>
            </header>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Ruchers</p>
                        <h3>Regroupés par catégorie</h3>
                    </div>
                    <p className="panel-caption">Modifiez les objectifs ou notes directement dans le tableau.</p>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Rucher</th>
                                <th>Catégorie</th>
                                <th>Localisation</th>
                                <th>Objectifs</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiaries.map((apiary) => (
                                <tr key={apiary.id}>
                                    <td>
                                        <strong>{apiary.name}</strong>
                                    </td>
                                    <td>{apiary.category || 'Non classé'}</td>
                                    <td>{apiary.location}</td>
                                    <td>
                                        <input
                                            id={`objectives-${apiary.id}`}
                                            type="text"
                                            value={apiary.objectives}
                                            onChange={(event) => updateApiary(apiary.id, { objectives: event.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <textarea
                                            id={`notes-${apiary.id}`}
                                            rows="2"
                                            value={apiary.notes}
                                            onChange={(event) => updateApiary(apiary.id, { notes: event.target.value })}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Rucher</th>
                                <th>Ruche</th>
                                <th>Type</th>
                                <th>Année reine</th>
                                <th>Statut</th>
                                <th>Population</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hives.map((hive) => {
                                const apiary = apiaries.find((item) => item.id === hive.apiaryId)
                                return (
                                    <tr key={hive.id}>
                                        <td>{apiary?.name || 'Rucher'}</td>
                                        <td>{hive.name}</td>
                                        <td>{hive.type}</td>
                                        <td>{hive.queenYear}</td>
                                        <td>
                                            <select
                                                id={`status-${hive.id}`}
                                                value={hive.status}
                                                onChange={(event) => updateHive(hive.id, { status: event.target.value })}
                                            >
                                                <option value="active">Active</option>
                                                <option value="monitor">À surveiller</option>
                                                <option value="archived">Archivée</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                id={`pop-${hive.id}`}
                                                value={hive.population}
                                                onChange={(event) => updateHive(hive.id, { population: event.target.value })}
                                            >
                                                <option>Forte</option>
                                                <option>Moyenne</option>
                                                <option>À surveiller</option>
                                            </select>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Visites</p>
                        <h3>Regroupement par rucher et type</h3>
                    </div>
                    <p className="panel-caption">Consultez les notes et mettez à jour poids ou observations.</p>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Rucher</th>
                                <th>Ruche</th>
                                <th>Poids (kg)</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visits.map((visit) => {
                                const hive = hives.find((item) => item.id === visit.hiveId)
                                const apiary = apiaries.find((item) => item.id === visit.apiaryId)
                                return (
                                    <tr key={visit.id}>
                                        <td>{new Date(visit.date).toLocaleDateString('fr-FR')}</td>
                                        <td>{apiary?.name || 'Rucher non renseigné'}</td>
                                        <td>{hive?.name || 'Ruche'}</td>
                                        <td>
                                            <input
                                                id={`weight-${visit.id}`}
                                                type="number"
                                                value={visit.weight}
                                                onChange={(event) => updateVisit(visit.id, { weight: Number(event.target.value) })}
                                            />
                                        </td>
                                        <td>
                                            <textarea
                                                id={`notes-${visit.id}`}
                                                rows="2"
                                                value={visit.notes}
                                                onChange={(event) => updateVisit(visit.id, { notes: event.target.value })}
                                            />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Récoltes</p>
                        <h3>Lots et ajustements rapides</h3>
                    </div>
                    <p className="panel-caption">Retrouvez les lots et corrigez quantité ou référence.</p>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Type de miel</th>
                                <th>Lot</th>
                                <th>Date</th>
                                <th>Quantité (kg)</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {harvests.map((harvest) => (
                                <tr key={harvest.id}>
                                    <td>{harvest.honeyType || 'Non renseigné'}</td>
                                    <td>
                                        <input
                                            id={`lot-${harvest.id}`}
                                            type="text"
                                            value={harvest.lot}
                                            onChange={(event) => updateHarvest(harvest.id, { lot: event.target.value })}
                                        />
                                    </td>
                                    <td>{new Date(harvest.date).toLocaleDateString('fr-FR')}</td>
                                    <td>
                                        <input
                                            id={`quantity-${harvest.id}`}
                                            type="number"
                                            value={harvest.quantityKg}
                                            onChange={(event) =>
                                                updateHarvest(harvest.id, { quantityKg: Number(event.target.value) })
                                            }
                                        />
                                    </td>
                                    <td>{harvest.notes || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Catégorie</th>
                                <th>Nom</th>
                                <th>Besoin</th>
                                <th>Stock</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipment.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.category || 'Non classé'}</td>
                                    <td>{item.name}</td>
                                    <td>
                                        <input
                                            id={`need-${item.id}`}
                                            type="number"
                                            value={item.needed}
                                            onChange={(event) =>
                                                updateEquipment(item.id, { needed: Number(event.target.value) })
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            id={`stock-${item.id}`}
                                            type="number"
                                            value={item.inStock}
                                            onChange={(event) =>
                                                updateEquipment(item.id, { inStock: Number(event.target.value) })
                                            }
                                        />
                                    </td>
                                    <td>{item.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

export default Records
