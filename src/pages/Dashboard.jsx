import React from 'react'
import { Link } from 'react-router-dom'
import { useBeeData } from '../context/BeeDataContext'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { highlightCards, inspiration } from '../data/dashboardData'

const heroImage = '/images/hero.jpg'

const formatFrenchDate = (date) =>
    date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

const getSeasonalWink = (today) => {
    const formatted = formatFrenchDate(today)

    if (today.getMonth() === 11) {
        return {
            date: formatted,
            text: `Le ${formatted}, laisse les colonies au calme : vérifie juste par dessous le poids des ruches et l’étanchéité. Un peu de candi si la balance faiblit, sinon couvre-plateaux bien posés pour un hivernage serein.`,
        }
    }

    return {
        date: formatted,
        text: `Le ${formatted}, observe l’équilibre réserves/couvain et ajuste l’aération. Un petit clin d’œil pour garder des colonies sereines selon la météo du moment.`,
    }
}

const StatCard = ({ icon, title, value, caption, valueClass = '' }) => (
    <Card className="stat-card">
        <CardContent className="flex items-start gap-4 p-6">
            <div className="text-2xl">{icon}</div>
            <div>
                <h3 className="text-sm font-medium text-stone-500 mb-1">{title}</h3>
                <p className={`text-2xl font-bold text-stone-800 mb-1 ${valueClass}`}>{value}</p>
                <p className="text-xs text-stone-400">{caption}</p>
            </div>
        </CardContent>
    </Card>
)

const Dashboard = () => {
    const { metrics, visits, hives, apiaries, equipment, updateEquipmentStock } = useBeeData()
    const seasonalWink = getSeasonalWink(new Date())

    const recentVisits = visits
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4)
        .map((visit) => ({
            ...visit,
            hiveName: hives.find((hive) => hive.id === visit.hiveId)?.name || 'Ruche inconnue',
            apiaryName: apiaries.find((apiary) => apiary.id === visit.apiaryId)?.name || 'Rucher non défini',
        }))

    const groupedEquipment = equipment.reduce((acc, item) => {
        const key = item.category || 'Non classé'
        acc[key] = acc[key] ? [...acc[key], item] : [item]
        return acc
    }, {})

    return (
        <div className="dashboard space-y-8">
            <section className="honey-banner bg-amber-50 rounded-xl overflow-hidden flex flex-col md:flex-row" aria-label="Référence apicole">
                <div className="p-8 flex-1">
                    <p className="text-amber-600 text-sm font-medium mb-2">Clin d'œil apicole · {seasonalWink.date}</p>
                    <h3 className="text-2xl font-serif text-amber-900 mb-4">Message du jour</h3>
                    <p className="text-amber-800 mb-6 leading-relaxed">{seasonalWink.text}</p>
                    <div className="flex gap-2">
                        <Badge variant="warning">Floraisons locales</Badge>
                        <Badge variant="warning">Hausses</Badge>
                        <Badge variant="warning">Récolte</Badge>
                    </div>
                </div>
                <div className="md:w-1/3 h-48 md:h-auto relative" role="img" aria-label="Pot de miel artisanal">
                    <img src="/images/honey-banner.jpg" alt="Pot de miel et rayon de cire" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                </div>
            </section>

            <section className="hero-panel relative rounded-xl overflow-hidden bg-stone-900 text-white" aria-label="Mise en avant apicole">
                <div className="absolute inset-0">
                    <img src={heroImage} alt="Cadre de ruche et abeilles" className="w-full h-full object-cover opacity-60" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
                </div>
                <div className="relative p-8 md:p-12 max-w-2xl">
                    <p className="text-amber-400 text-sm font-medium mb-2">Carnet de rucher · Saison en cours</p>
                    <h2 className="text-3xl md:text-4xl font-serif mb-4">Un tableau de bord prêt pour vos prochaines visites</h2>
                    <p className="text-stone-300 mb-8 text-lg">
                        Suivez vos colonies, préparez les hausses et anticipez les floraisons clés grâce à un espace
                        visuel et inspiré par l’apiculture.
                    </p>
                    <div className="flex gap-4 mb-8">
                        <Link className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors" to="/visit">
                            Planifier une visite
                        </Link>
                        <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm" type="button">
                            Exporter mes notes
                        </button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['Pollinisation', 'Couvain', 'Miellée', 'Traitements doux'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs backdrop-blur-sm border border-white/20">{tag}</span>
                        ))}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon="🐝"
                    title="Ruches actives"
                    value={metrics.activeHives}
                    caption="Butineuses observées cette semaine"
                />
                <StatCard
                    icon="🌿"
                    title="Visites ce mois"
                    value={metrics.visitsLast30Days}
                    caption="Inspections planifiées et réalisées"
                />
                <StatCard
                    icon="🍯"
                    title="Santé globale"
                    value={metrics.health}
                    caption="Indice sur la vitalité des colonies"
                    valueClass="text-emerald-600"
                />
                <StatCard
                    icon="🍯"
                    title="Récolté cette année"
                    value={`${metrics.totalHarvestKg} kg`}
                    caption="Somme des lots saisis"
                />
            </div>

            <section className="space-y-4" aria-label="Synthèse rucher">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-stone-500 text-sm font-medium">Suivi terrain</p>
                        <h3 className="text-xl font-serif text-stone-800">Tendance des visites</h3>
                    </div>
                    <p className="text-sm text-stone-400">Masse moyenne : {metrics.avgWeight} kg sur les visites enregistrées.</p>
                </div>
                <div className="space-y-3">
                    {recentVisits.map((visit) => (
                        <Card key={visit.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="flex flex-col md:flex-row gap-4 p-4">
                                <div className="md:w-48 shrink-0">
                                    <p className="font-medium text-stone-800">{new Date(visit.date).toLocaleDateString('fr-FR')}</p>
                                    <p className="text-sm text-stone-500">{visit.apiaryName} · {visit.hiveName}</p>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex gap-2 flex-wrap">
                                        <Badge>Poids {visit.weight} kg</Badge>
                                        <Badge>{visit.weather}</Badge>
                                        <Badge>Couvain : {visit.broodPattern}</Badge>
                                    </div>
                                    <p className="text-stone-600 text-sm">{visit.notes}</p>
                                </div>
                                {visit.photo && (
                                    <div className="shrink-0 md:w-24 h-24 rounded-lg overflow-hidden relative group">
                                        <img src={visit.photo.dataUrl} alt={visit.photo.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="space-y-4" aria-label="Matériel et stock">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-stone-500 text-sm font-medium">Préparation matériel</p>
                        <h3 className="text-xl font-serif text-stone-800">Matériel nécessaire et en stock</h3>
                    </div>
                    <p className="text-sm text-stone-400">Cadres, hausses, traitements et pots prêts pour les prochaines visites.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(groupedEquipment).map(([category, items]) => (
                        <Card key={category}>
                            <CardContent className="p-6 space-y-4">
                                <h4 className="font-medium text-stone-800 border-b border-stone-100 pb-2">{category}</h4>
                                <div className="space-y-4">
                                    {items.map((item) => {
                                        const ratio = item.needed
                                            ? Math.min(100, Math.round((item.inStock / item.needed) * 100))
                                            : 100
                                        return (
                                            <div key={item.id} className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h5 className="text-sm font-medium text-stone-700">{item.name}</h5>
                                                        <p className="text-xs text-stone-400">{item.note}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-mono bg-stone-100 px-2 py-1 rounded">
                                                            {item.inStock}/{item.needed}
                                                        </span>
                                                        <div className="flex gap-1">
                                                            <button
                                                                type="button"
                                                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-stone-100 text-stone-500"
                                                                onClick={() => updateEquipmentStock(item.id, 1)}
                                                            >
                                                                +
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-stone-100 text-stone-500"
                                                                onClick={() => updateEquipmentStock(item.id, -1)}
                                                            >
                                                                -
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${ratio >= 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                        style={{ width: `${ratio}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="space-y-4" aria-label="Moments forts apicoles">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-stone-500 text-sm font-medium">Galerie terrain</p>
                        <h3 className="text-xl font-serif text-stone-800">Des gestes inspirés par les ruchers</h3>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {highlightCards.map((item) => (
                        <Card key={item.title} className="group hover:shadow-lg transition-all duration-300">
                            <div className="h-48 relative overflow-hidden">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">Ref apicole</div>
                            </div>
                            <CardContent className="p-4">
                                <h4 className="font-medium text-lg text-stone-800 mb-2">{item.title}</h4>
                                <p className="text-stone-600 text-sm mb-4">{item.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag) => (
                                        <Badge key={tag} variant="default">{tag}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="bg-stone-50 rounded-xl p-6 md:p-8" aria-label="Clés de lecture du rucher">
                <div className="mb-6">
                    <p className="text-stone-500 text-sm font-medium">Signes à surveiller</p>
                    <h3 className="text-xl font-serif text-stone-800">Les petits indices qui changent tout</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {inspiration.map((item) => (
                        <div key={item.title} className="bg-white p-4 rounded-lg border border-stone-100 shadow-sm">
                            <h4 className="font-medium text-stone-800 mb-2">{item.title}</h4>
                            <p className="text-sm text-stone-600">{item.text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Dashboard
