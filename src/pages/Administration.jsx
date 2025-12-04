import React, { useMemo, useState } from 'react'
import { Download, FileSpreadsheet, Mail, RefreshCw } from 'lucide-react'
import { useBeeData } from '../context/BeeDataContext'

const Administration = () => {
    const { exportData, importData, visits, equipment } = useBeeData()
    const [reportType, setReportType] = useState('visits')
    const [email, setEmail] = useState('')
    const [feedback, setFeedback] = useState('')

    const stats = useMemo(
        () => ({
            visits: visits.length,
            equipment: equipment.length,
        }),
        [visits, equipment],
    )

    const handleExport = () => {
        const payload = exportData()
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = 'rucher-backup.json'
        link.click()
        URL.revokeObjectURL(url)
        setFeedback('Sauvegarde exportée depuis la base locale.')
    }

    const handleImport = (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (loadEvent) => {
            try {
                const content = JSON.parse(loadEvent.target.result)
                importData(content)
                setFeedback('Données restaurées dans la base locale.')
            } catch (error) {
                setFeedback('Fichier illisible, merci de vérifier son format JSON.')
            }
        }
        reader.readAsText(file)
    }

    const handleShare = (event) => {
        event.preventDefault()
        setFeedback(`Un rapport ${reportType} est prêt pour ${email || 'votre destinataire'}.`)
    }

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Administration</p>
                    <h3>Sauvegardes et diffusion des rapports</h3>
                    <p className="panel-caption">
                        Centralisez les sauvegardes, restaurez vos données locales et partagez les rapports de visites ou
                        d’inventaire par e-mail.
                    </p>
                </div>
            </header>

            <section className="panel">
                <div className="definition-grid">
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Sauvegarde</h4>
                            <Download size={18} />
                        </div>
                        <p className="muted">Exportez un instantané complet de la base pour un archivage sécurisé.</p>
                        <button type="button" className="btn-primary" onClick={handleExport}>
                            Télécharger la sauvegarde
                        </button>
                    </article>
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Restauration</h4>
                            <RefreshCw size={18} />
                        </div>
                        <p className="muted">Réimportez une sauvegarde JSON pour revenir à un état antérieur.</p>
                        <label className="btn-ghost" htmlFor="restore-input">
                            Choisir un fichier
                        </label>
                        <input id="restore-input" type="file" accept="application/json" onChange={handleImport} hidden />
                    </article>
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Rapports</h4>
                            <FileSpreadsheet size={18} />
                        </div>
                        <p className="muted">Générez un rapport synthétique pour vos visites ou vos inventaires.</p>
                        <form className="definition-form" onSubmit={(event) => event.preventDefault()}>
                            <div className="form-group">
                                <label htmlFor="reportType">Type de rapport</label>
                                <select
                                    id="reportType"
                                    value={reportType}
                                    onChange={(event) => setReportType(event.target.value)}
                                >
                                    <option value="visits">Visites</option>
                                    <option value="inventaires">Inventaires</option>
                                </select>
                            </div>
                            <button type="button" className="btn-primary" onClick={() => setFeedback('Rapport généré')}>
                                Générer
                            </button>
                        </form>
                    </article>
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Partage par e-mail</h4>
                            <Mail size={18} />
                        </div>
                        <p className="muted">Envoyez rapidement un rapport de visite ou d’inventaire.</p>
                        <form className="definition-form" onSubmit={handleShare}>
                            <div className="form-group">
                                <label htmlFor="email">Destinataire</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="contact@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="shareType">Rapport à partager</label>
                                <select
                                    id="shareType"
                                    value={reportType}
                                    onChange={(event) => setReportType(event.target.value)}
                                >
                                    <option value="visites">Visites</option>
                                    <option value="inventaires">Inventaires</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-primary">
                                Préparer l’envoi
                            </button>
                        </form>
                    </article>
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Contrôle</p>
                        <h3>Indicateurs rapides</h3>
                        <p className="panel-caption">Un aperçu des volumes disponibles pour les rapports.</p>
                    </div>
                </div>
                <div className="pill-row">
                    <div className="pill">{stats.visits} visites historisées</div>
                    <div className="pill">{stats.equipment} éléments d’inventaire</div>
                </div>
                {feedback && (
                    <div className="alert success" role="status">
                        {feedback}
                    </div>
                )}
            </section>
        </div>
    )
}

export default Administration
