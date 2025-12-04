import React, { useMemo } from 'react'
import { useBeeData } from '../context/BeeDataContext'

const HoneyInventory = () => {
    const { harvests, apiaries, hives, movements } = useBeeData()

    const movementByLot = useMemo(
        () =>
            movements.reduce((acc, movement) => {
                const key = movement.lot || 'Non renseigné'
                const quantity = Number(movement.quantity) || 0
                acc[key] = (acc[key] || 0) + quantity
                return acc
            }, {}),
        [movements],
    )

    const detailedLots = useMemo(
        () =>
            harvests.map((lot) => {
                const apiary = apiaries.find((item) => item.id === lot.apiaryId)
                const hive = hives.find((item) => item.id === lot.hiveId)
                const moved = movementByLot[lot.lot] || 0
                const available = Math.max(0, (lot.quantityKg || 0) - moved)
                return {
                    ...lot,
                    apiaryName: apiary?.name || 'Rucher',
                    hiveName: hive?.name || 'Ruche',
                    moved,
                    available,
                }
            }),
        [harvests, apiaries, hives, movementByLot],
    )

    const summary = useMemo(() => {
        return detailedLots.reduce((acc, lot) => {
            const key = lot.honeyType || 'Non renseigné'
            const current = acc[key] || { total: 0, available: 0 }
            current.total += lot.quantityKg || 0
            current.available += lot.available
            acc[key] = current
            return acc
        }, {})
    }, [detailedLots])

    return (
        <div className="panel">
            <div className="panel-header">
                <div>
                    <p className="eyebrow">Inventaires miel</p>
                    <h3>Visibilité sur les lots disponibles</h3>
                    <p className="panel-caption">
                        Synthèse par type de miel et détail par lot pour connaître le stock restant après mouvements.
                    </p>
                </div>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Vue synthétique</p>
                        <h3>Volumes par type de miel</h3>
                    </div>
                    <p className="panel-caption">Total récolté et stock disponible en incluant les mouvements enregistrés.</p>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Quantité totale (kg)</th>
                                <th>Disponible (kg)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(summary).map(([type, values]) => (
                                <tr key={type}>
                                    <td>{type}</td>
                                    <td>{values.total.toFixed(1)}</td>
                                    <td>{values.available.toFixed(1)}</td>
                                </tr>
                            ))}
                            {Object.keys(summary).length === 0 && (
                                <tr>
                                    <td colSpan={3} className="muted">
                                        Aucun lot renseigné.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Détail des lots</p>
                        <h3>Mise en pots et disponibilité</h3>
                    </div>
                    <p className="panel-caption">Chaque lot indique son rucher d'origine, l'état de mise en pots et le stock.</p>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Lot</th>
                                <th>Type</th>
                                <th>Rucher / Ruche</th>
                                <th>Quantité (kg)</th>
                                <th>Humidité (%)</th>
                                <th>Mise en pots</th>
                                <th>Stock disponible (kg)</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detailedLots.map((lot) => (
                                <tr key={lot.id}>
                                    <td>{lot.lot || 'À renseigner'}</td>
                                    <td>{lot.honeyType || 'Non renseigné'}</td>
                                    <td>
                                        {lot.apiaryName} — {lot.hiveName}
                                    </td>
                                    <td>{lot.quantityKg || 0}</td>
                                    <td>{lot.humidity ?? '—'}</td>
                                    <td>{lot.jarred ? 'Réalisée' : 'À planifier'}</td>
                                    <td>{lot.available.toFixed(1)}</td>
                                    <td>{lot.jarNotes || lot.notes || '—'}</td>
                                </tr>
                            ))}
                            {detailedLots.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="muted">
                                        Aucun lot de miel n'a encore été enregistré.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default HoneyInventory
