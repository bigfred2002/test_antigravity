import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Download, ExternalLink, FileSpreadsheet, Image, Mail, Phone, RefreshCw } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { useBeeData } from '../context/BeeDataContext'

const Administration = () => {
    const { exportData, importData, visits, equipment, harvests, knowledge, apiaries, hives } = useBeeData()
    const [reportType, setReportType] = useState('visits')
    const [email, setEmail] = useState('')
    const [feedback, setFeedback] = useState('')

    const reportOptions = {
        visits: 'Visites',
        inventory: 'Inventaires',
        harvests: 'Récoltes',
    }

    const apiaryLookup = useMemo(
        () => Object.fromEntries(apiaries.map((apiary) => [apiary.id, apiary.name])),
        [apiaries],
    )

    const hiveLookup = useMemo(() => Object.fromEntries(hives.map((hive) => [hive.id, hive.name])), [hives])

    const stats = useMemo(
        () => ({
            visits: visits.length,
            equipment: equipment.length,
            harvests: harvests.length,
            contacts: knowledge.contacts?.length || 0,
            documents: knowledge.documents?.length || 0,
            gallery: knowledge.gallery?.length || 0,
        }),
        [visits, equipment, harvests, knowledge.contacts, knowledge.documents, knowledge.gallery],
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
            } catch {
                setFeedback('Fichier illisible, merci de vérifier son format JSON.')
            }
        }
        reader.readAsText(file)
    }

    const buildReport = () => {
        const generatedAt = new Date().toISOString()
        if (reportType === 'visits') {
            return {
                generatedAt,
                type: 'visits',
                total: visits.length,
                visits: visits.map((visit) => ({
                    id: visit.id,
                    apiaryId: visit.apiaryId,
                    apiaryName: apiaryLookup[visit.apiaryId] || 'Rucher',
                    hiveId: visit.hiveId,
                    hiveName: hiveLookup[visit.hiveId] || 'Ruche',
                    date: visit.date,
                    weight: visit.weight,
                    notes: visit.notes,
                })),
            }
        }
        if (reportType === 'inventory') {
            return {
                generatedAt,
                type: 'inventory',
                total: equipment.length,
                items: equipment.map((item) => ({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    needed: item.needed,
                    inStock: item.inStock,
                    note: item.note || '',
                })),
            }
        }
        return {
            generatedAt,
            type: 'harvests',
            total: harvests.length,
            harvests: harvests.map((harvest) => ({
                id: harvest.id,
                apiaryId: harvest.apiaryId,
                apiaryName: apiaryLookup[harvest.apiaryId] || 'Rucher',
                hiveId: harvest.hiveId,
                hiveName: hiveLookup[harvest.hiveId] || 'Ruche',
                date: harvest.date,
                lot: harvest.lot,
                quantityKg: harvest.quantityKg,
                honeyType: harvest.honeyType,
            })),
        }
    }

    const addPdfLine = (doc, text, state) => {
        const lines = doc.splitTextToSize(text, 180)
        lines.forEach((line) => {
            if (state.cursorY > 280) {
                doc.addPage()
                state.cursorY = 20
            }
            doc.text(line, 14, state.cursorY)
            state.cursorY += 6
        })
    }

    const downloadPdfReport = (payload, label) => {
        const doc = new jsPDF()
        const state = { cursorY: 26 }

        doc.setFontSize(16)
        doc.text(`Rapport ${label}`, 14, 18)
        doc.setFontSize(10)
        addPdfLine(doc, `Généré le ${new Date(payload.generatedAt).toLocaleString('fr-FR')}`, state)
        addPdfLine(doc, `Total ${label.toLowerCase()} : ${payload.total}`, state)
        state.cursorY += 4

        if (payload.type === 'visits') {
            payload.visits.forEach((visit, index) => {
                addPdfLine(doc, `Visite ${index + 1} · ${visit.date}`, state)
                addPdfLine(
                    doc,
                    `Rucher : ${visit.apiaryName} — Ruche : ${visit.hiveName} — Poids : ${visit.weight || 0} kg`,
                    state,
                )
                addPdfLine(doc, `Notes : ${visit.notes || 'Aucune note renseignée'}`, state)
                state.cursorY += 2
            })
        }

        if (payload.type === 'inventory') {
            payload.items.forEach((item, index) => {
                addPdfLine(doc, `${index + 1}. ${item.name} (${item.category})`, state)
                addPdfLine(doc, `Stock : ${item.inStock}/${item.needed} · Note : ${item.note || '—'}`, state)
                state.cursorY += 2
            })
        }

        if (payload.type === 'harvests') {
            payload.harvests.forEach((harvest, index) => {
                addPdfLine(doc, `Lot ${index + 1} · ${harvest.lot} (${harvest.date})`, state)
                addPdfLine(
                    doc,
                    `${harvest.honeyType} — ${harvest.quantityKg} kg · ${harvest.apiaryName} / ${harvest.hiveName}`,
                    state,
                )
                state.cursorY += 2
            })
        }

        doc.save(`rapport-${payload.type}-${new Date().toISOString().slice(0, 10)}.pdf`)
    }

    const handleGenerateReport = () => {
        const payload = buildReport()
        const label = reportOptions[reportType] || 'rapport'
        downloadPdfReport(payload, label)
        setFeedback(`Rapport ${label} généré et téléchargé en PDF.`)
    }

    const handleShare = (event) => {
        event.preventDefault()
        const label = reportOptions[reportType] || 'rapport'
        setFeedback(`Un rapport ${label} en PDF est prêt pour ${email || 'votre destinataire'}.`)
    }

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Administration</p>
                    <h3>Sauvegardes et diffusion des rapports</h3>
                    <p className="panel-caption">
                        Centralisez les sauvegardes, restaurez vos données locales, téléchargez des rapports et gérez la base
                        de connaissance sans dépendre de ressources externes.
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
                        <p className="muted">Générez un rapport synthétique et téléchargez-le instantanément.</p>
                        <form className="definition-form" onSubmit={(event) => event.preventDefault()}>
                            <div className="form-group">
                                <label htmlFor="reportType">Type de rapport</label>
                                <select
                                    id="reportType"
                                    value={reportType}
                                    onChange={(event) => setReportType(event.target.value)}
                                >
                                    <option value="visits">Visites</option>
                                    <option value="inventory">Inventaires</option>
                                    <option value="harvests">Récoltes</option>
                                </select>
                            </div>
                            <button type="button" className="btn-primary" onClick={handleGenerateReport}>
                                Générer et télécharger
                            </button>
                        </form>
                    </article>
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Partage par e-mail</h4>
                            <Mail size={18} />
                        </div>
                        <p className="muted">Envoyez rapidement un rapport de visite, d’inventaire ou de récoltes.</p>
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
                                    <option value="visits">Visites</option>
                                    <option value="inventory">Inventaires</option>
                                    <option value="harvests">Récoltes</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-primary">
                                Préparer l’envoi
                            </button>
                        </form>
                    </article>
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Contacts</h4>
                            <Phone size={18} />
                        </div>
                        <p className="muted">Ajoutez ou retirez les personnes à joindre rapidement.</p>
                        <p className="muted small">{stats.contacts || 0} fiches disponibles.</p>
                        <Link to="/administration/knowledge/contacts" className="btn-primary">
                            Gérer les contacts
                        </Link>
                    </article>
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Sites web</h4>
                            <ExternalLink size={18} />
                        </div>
                        <p className="muted">Centralisez les liens météo, techniques ou associatifs.</p>
                        <p className="muted small">{knowledge.sites.length} liens enregistrés.</p>
                        <Link to="/administration/knowledge/sites" className="btn-primary">
                            Gérer les sites
                        </Link>
                    </article>
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Documents</h4>
                            <BookOpen size={18} />
                        </div>
                        <p className="muted">Ajoutez vos procédures, check-lists et fichiers clés.</p>
                        <p className="muted small">{stats.documents} documents disponibles.</p>
                        <Link to="/administration/knowledge/documents" className="btn-primary">
                            Gérer les documents
                        </Link>
                    </article>
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Galerie</h4>
                            <Image size={18} />
                        </div>
                        <p className="muted">Mettez à jour les images partagées dans les ressources.</p>
                        <p className="muted small">{stats.gallery} entrée(s) dans la galerie.</p>
                        <Link to="/administration/gallery" className="btn-primary">
                            Gérer la galerie
                        </Link>
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
                    <div className="pill">{stats.harvests} lots de récolte</div>
                    <div className="pill">{stats.documents} documents enregistrés</div>
                    <div className="pill">{stats.gallery} visuels en galerie</div>
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
