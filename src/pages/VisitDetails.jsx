import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useBeeData } from '../context/BeeDataContext'

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : 'Non renseigné')

const VisitDetails = () => {
    const { visitId } = useParams()
    const { visits, hives, apiaries } = useBeeData()

    const visit = visits.find((item) => item.id === visitId)
    const hive = visit ? hives.find((item) => item.id === visit.hiveId) : null
    const apiary = visit ? apiaries.find((item) => item.id === visit.apiaryId) : null

    if (!visit) {
        return (
            <div className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Fiche de visite</p>
                        <h3>Visite introuvable</h3>
                        <p className="panel-caption">La fiche demandée n'existe pas ou a été supprimée.</p>
                    </div>
                    <Link className="btn-primary" to="/visits">
                        Retour au suivi des visites
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="panel">
            <div className="panel-header">
                <div>
                    <p className="eyebrow">Fiche de visite</p>
                    <h3>
                        {hive?.name || 'Ruche'} — {formatDate(visit.date)}
                    </h3>
                    <p className="panel-caption">
                        Toutes les informations saisies pour cette inspection, y compris les ressources téléchargées.
                    </p>
                </div>
                <Link className="btn-ghost" to="/visits">
                    Retour au tableau des visites
                </Link>
            </div>

            <div className="definition-grid">
                <article className="definition-card">
                    <h4>Identification</h4>
                    <dl className="detail-grid">
                        <div>
                            <dt>Date</dt>
                            <dd>{formatDate(visit.date)}</dd>
                        </div>
                        <div>
                            <dt>Rucher</dt>
                            <dd>{apiary?.name || 'Non renseigné'}</dd>
                        </div>
                        <div>
                            <dt>Ruche</dt>
                            <dd>{hive?.name || 'Non renseignée'}</dd>
                        </div>
                        <div>
                            <dt>Poids</dt>
                            <dd>{visit.weight ? `${visit.weight} kg` : 'Non mesuré'}</dd>
                        </div>
                        <div>
                            <dt>Météo</dt>
                            <dd>{visit.weather || 'Non renseignée'}</dd>
                        </div>
                        <div>
                            <dt>Hausses</dt>
                            <dd>{visit.honeySupers || 'Non indiqué'}</dd>
                        </div>
                    </dl>
                </article>

                <article className="definition-card">
                    <h4>État de la colonie</h4>
                    <dl className="detail-grid">
                        <div>
                            <dt>Force</dt>
                            <dd>{visit.colonyStrength || 'Non évaluée'}</dd>
                        </div>
                        <div>
                            <dt>Couvain</dt>
                            <dd>{visit.broodPattern || 'Non décrit'}</dd>
                        </div>
                        <div>
                            <dt>Traitement / nourrissement</dt>
                            <dd>{visit.treatment || 'Aucun'}</dd>
                        </div>
                        <div>
                            <dt>Notes</dt>
                            <dd>{visit.notes || 'Aucune note'}</dd>
                        </div>
                    </dl>
                </article>

                <article className="definition-card">
                    <h4>Ressources téléchargées</h4>
                    {visit.photo ? (
                        <div className="visit-resource">
                            <img src={visit.photo.dataUrl} alt={visit.photo.name} className="resource-preview" />
                            <div>
                                <p className="eyebrow">{visit.photo.name}</p>
                                <a className="btn-primary" href={visit.photo.dataUrl} download={visit.photo.name}>
                                    Télécharger la ressource
                                </a>
                            </div>
                        </div>
                    ) : (
                        <p className="muted">Aucune ressource n'a été associée à cette visite.</p>
                    )}
                </article>
            </div>
        </div>
    )
}

export default VisitDetails
