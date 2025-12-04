import React, { useMemo, useState } from 'react'
import { useBeeData } from '../context/BeeDataContext'

const VisitHistory = () => {
    const { visits, hives, apiaries, updateVisit } = useBeeData()
    const [filterApiary, setFilterApiary] = useState('')
    const [filterHive, setFilterHive] = useState('')

    const filteredVisits = useMemo(() => {
        return visits
            .filter((visit) => (filterApiary ? visit.apiaryId === filterApiary : true))
            .filter((visit) => (filterHive ? visit.hiveId === filterHive : true))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
    }, [visits, filterApiary, filterHive])

    const hiveOptions = useMemo(() => {
        return hives
            .filter((hive) => (filterApiary ? hive.apiaryId === filterApiary : true))
            .map((hive) => ({ value: hive.id, label: hive.name }))
    }, [hives, filterApiary])

    return (
        <div className="panel">
            <div className="panel-header">
                <div>
                    <p className="eyebrow">Suivi des visites</p>
                    <h3>Consulter et actualiser les inspections</h3>
                    <p className="panel-caption">
                        Filtrez par rucher ou par ruche puis ajustez les notes et mesures sans passer par la saisie.
                    </p>
                </div>
                <div className="filter-row">
                    <label className="filter">
                        Rucher
                        <select value={filterApiary} onChange={(event) => setFilterApiary(event.target.value)}>
                            <option value="">Tous</option>
                            {apiaries.map((apiary) => (
                                <option key={apiary.id} value={apiary.id}>
                                    {apiary.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="filter">
                        Ruche
                        <select value={filterHive} onChange={(event) => setFilterHive(event.target.value)}>
                            <option value="">Toutes</option>
                            {hiveOptions.map((hive) => (
                                <option key={hive.value} value={hive.value}>
                                    {hive.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Rucher</th>
                            <th>Ruche</th>
                            <th>Poids (kg)</th>
                            <th>Météo</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVisits.map((visit) => {
                            const hive = hives.find((item) => item.id === visit.hiveId)
                            const apiary = apiaries.find((item) => item.id === visit.apiaryId)
                            return (
                                <tr key={visit.id}>
                                    <td>{new Date(visit.date).toLocaleDateString('fr-FR')}</td>
                                    <td>{apiary?.name || 'Rucher'}</td>
                                    <td>{hive?.name || 'Ruche'}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={visit.weight}
                                            onChange={(event) =>
                                                updateVisit(visit.id, { weight: Number(event.target.value) })
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={visit.weather}
                                            onChange={(event) => updateVisit(visit.id, { weather: event.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <textarea
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
                {filteredVisits.length === 0 && <p className="muted">Aucune visite à afficher avec ces filtres.</p>}
            </div>
        </div>
    )
}

export default VisitHistory
