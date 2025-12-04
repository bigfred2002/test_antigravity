import React from 'react'
import { Link } from 'react-router-dom'
import { useBeeData } from '../context/BeeDataContext'

const heroImage =
    'https://images.unsplash.com/photo-1498601761256-5c1d2dbeedcb?auto=format&fit=crop&w=1400&q=80'

const highlightCards = [
    {
        title: 'Inspection de printemps',
        description: 'Observer la reprise de ponte, vérifier la place disponible et ajuster l’aération.',
        image:
            'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=80',
        tags: ['Reine vue', 'Cadres équilibrés', 'Réserves ok'],
    },
    {
        title: 'Miellée en cours',
        description: 'Surveiller le poids, poser ou retirer les hausses et suivre la floraison locale.',
        image:
            'https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?auto=format&fit=crop&w=900&q=80',
        tags: ['Balance', 'Hausses', 'Floraisons'],
    },
    {
        title: 'Douceur de miel',
        description: 'Un miel clair et parfumé obtenu grâce à une récolte patiente et bien préparée.',
        image:
            'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80',
        tags: ['Récolte', 'Filtration', 'Maturation'],
    },
]

const inspiration = [
    {
        title: 'Couleur du couvain',
        text: 'Une teinte homogène et brillante signale un couvain sain.',
    },
    {
        title: 'Vol calme à l’entrée',
        text: 'Des abeilles régulières et non agressives indiquent une colonie apaisée.',
    },
    {
        title: 'Réserves équilibrées',
        text: 'Nectar, pollen et miel sont bien répartis sur les cadres extérieurs.',
    },
]

const Dashboard = () => {
    const { metrics, visits, hives, equipment, updateEquipmentStock } = useBeeData()

    const recentVisits = visits
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4)
        .map((visit) => ({
            ...visit,
            hiveName: hives.find((hive) => hive.id === visit.hiveId)?.name || 'Ruche inconnue',
        }))
    return (
        <div className="dashboard">
            <section className="hero-panel" aria-label="Mise en avant apicole">
                <div className="hero-text">
                    <p className="eyebrow">Carnet de rucher · Saison en cours</p>
                    <h2>Un tableau de bord prêt pour vos prochaines visites</h2>
                    <p className="hero-subtitle">
                        Suivez vos colonies, préparez les hausses et anticipez les floraisons clés grâce à un espace
                        visuel et inspiré par l’apiculture.
                    </p>
                    <div className="hero-actions">
                        <Link className="btn-primary" to="/visit">
                            Planifier une visite
                        </Link>
                        <button className="btn-ghost" type="button">
                            Exporter mes notes
                        </button>
                    </div>
                    <div className="hero-pill-row">
                        <span className="pill">Pollinisation</span>
                        <span className="pill">Couvain</span>
                        <span className="pill">Miellée</span>
                        <span className="pill">Traitements doux</span>
                    </div>
                </div>
                <div className="hero-visual" role="img" aria-label="Cadre de ruche et abeilles au soleil">
                    <div className="hero-image-wrap">
                        <img src={heroImage} alt="Cadre de ruche et abeilles" loading="lazy" />
                        <div className="hero-badge">Série printemps 2024</div>
                    </div>
                </div>
            </section>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🐝</div>
                    <div>
                        <h3>Ruches actives</h3>
                        <p className="value">{metrics.activeHives}</p>
                        <p className="stat-caption">Butineuses observées cette semaine</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🌿</div>
                    <div>
                        <h3>Visites ce mois</h3>
                        <p className="value">{metrics.visitsLast30Days}</p>
                        <p className="stat-caption">Inspections planifiées et réalisées</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🍯</div>
                    <div>
                        <h3>Santé globale</h3>
                        <p className="value good">{metrics.health}</p>
                        <p className="stat-caption">Indice sur la vitalité des colonies</p>
                    </div>
                </div>
            </div>

            <section className="panel" aria-label="Synthèse rucher">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Suivi terrain</p>
                        <h3>Tendance des visites</h3>
                    </div>
                    <p className="panel-caption">Masse moyenne : {metrics.avgWeight} kg sur les visites enregistrées.</p>
                </div>
                <div className="recent-visits">
                    {recentVisits.map((visit) => (
                        <article key={visit.id} className="visit-row" aria-label={`Visite du ${visit.date}`}>
                            <div className="visit-meta">
                                <p className="visit-date">{new Date(visit.date).toLocaleDateString('fr-FR')}</p>
                                <p className="visit-hive">{visit.hiveName}</p>
                            </div>
                            <div className="visit-info">
                                <span className="pill">Poids {visit.weight} kg</span>
                                <span className="pill">{visit.weather}</span>
                                <span className="pill">Couvain : {visit.broodPattern}</span>
                            </div>
                            <div className="visit-content">
                                <p className="visit-notes">{visit.notes}</p>
                                {visit.photo && (
                                    <div className="visit-photo" aria-label="Photo de la visite">
                                        <img src={visit.photo.dataUrl} alt={visit.photo.name} />
                                        <p className="muted">{visit.photo.name}</p>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="panel" aria-label="Matériel et stock">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Préparation matériel</p>
                        <h3>Matériel nécessaire et en stock</h3>
                    </div>
                    <p className="panel-caption">Cadres, hausses, traitements et pots prêts pour les prochaines visites.</p>
                </div>
                <div className="equipment-grid">
                    {equipment.map((item) => {
                        const ratio = Math.min(100, Math.round((item.inStock / item.needed) * 100))
                        return (
                            <article key={item.id} className="equipment-card" aria-label={item.name}>
                                <div className="equipment-card__header">
                                    <div>
                                        <p className="eyebrow">{item.category}</p>
                                        <h4>{item.name}</h4>
                                    </div>
                                    <span className="pill">
                                        {item.inStock}/{item.needed}
                                    </span>
                                </div>
                                <p className="equipment-note">{item.note}</p>
                                <div className="progress">
                                    <div className="progress-bar" style={{ width: `${ratio}%` }} />
                                </div>
                                <div className="equipment-actions">
                                    <button type="button" className="btn-ghost" onClick={() => updateEquipmentStock(item.id, 1)}>
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
                        )
                    })}
                </div>
            </section>

            <section className="highlight" aria-label="Moments forts apicoles">
                <div className="section-header">
                    <div>
                        <p className="eyebrow">Galerie terrain</p>
                        <h3>Des gestes inspirés par les ruchers</h3>
                    </div>
                    <p className="section-subtitle">
                        Trois repères visuels pour ancrer vos inspections : ouverture, suivi de miellée et récolte.
                    </p>
                </div>
                <div className="highlight-grid">
                    {highlightCards.map((item) => (
                        <article className="highlight-card" key={item.title}>
                            <div className="highlight-image">
                                <img src={item.image} alt={item.title} loading="lazy" />
                                <div className="image-chip">Ref apicole</div>
                            </div>
                            <div className="highlight-body">
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                                <div className="pill-row">
                                    {item.tags.map((tag) => (
                                        <span className="pill" key={tag}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="inspiration" aria-label="Clés de lecture du rucher">
                <div className="section-header">
                    <div>
                        <p className="eyebrow">Signes à surveiller</p>
                        <h3>Les petits indices qui changent tout</h3>
                    </div>
                    <p className="section-subtitle">
                        Des rappels courts pour mieux interpréter vos observations entre deux visites.
                    </p>
                </div>
                <div className="inspiration-grid">
                    {inspiration.map((item) => (
                        <article className="inspiration-card" key={item.title}>
                            <h4>{item.title}</h4>
                            <p>{item.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="honey-banner" aria-label="Référence apicole">
                <div className="banner-content">
                    <p className="eyebrow">Clin d'œil apicole</p>
                    <h3>Préparer la prochaine miellée</h3>
                    <p>
                        Suivez la floraison locale, anticipez la pose des hausses et remerciez vos abeilles avec des
                        visites régulières et sereines.
                    </p>
                    <div className="banner-tags">
                        <span>Floraisons locales</span>
                        <span>Hausses</span>
                        <span>Récolte</span>
                    </div>
                </div>
                <div className="banner-visual" role="img" aria-label="Pot de miel artisanal">
                    <img
                        src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=700&q=80"
                        alt="Pot de miel et rayon de cire"
                        loading="lazy"
                    />
                </div>
            </section>
        </div>
    )
}

export default Dashboard
