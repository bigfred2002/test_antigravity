import React from 'react'

const heroImage =
    'https://images.unsplash.com/photo-1502590464431-3b66d77494bc?auto=format&fit=crop&w=1200&q=80'

const galleryItems = [
    {
        title: 'Butinage en pleine floraison',
        description: 'Des abeilles au travail sur des fleurs mellifères pour nourrir la colonie.',
        image:
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    },
    {
        title: 'Cadres et cire fraîche',
        description: "Une ruche bien entretenue avec des cadres réguliers et une cire claire.",
        image:
            'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=900&q=80',
    },
    {
        title: 'Apiculteur en inspection',
        description: "Visite guidée pour vérifier l'état du couvain et la présence de la reine.",
        image:
            'https://images.unsplash.com/photo-1515164303-0f3297bb656f?auto=format&fit=crop&w=900&q=80',
    },
]

const Dashboard = () => {
    const { hives, visits, loading, error, fetchData } = useApiStore(
        (state) => ({
            hives: state.hives,
            visits: state.visits,
            loading: state.loading,
            error: state.error,
            fetchData: state.fetchData,
        }),
    );

    useEffect(() => {
        if (!hives.length && !loading && !error) {
            fetchData();
        }
    }, [fetchData, hives.length, loading, error]);

    const activeHivesCount = useMemo(
        () => hives.filter((hive) => hive.active).length,
        [hives],
    );

    const visitsLast30Days = useMemo(() => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);

        return visits.filter((visit) => new Date(visit.date) >= cutoff).length;
    }, [visits]);

    const averageHealth = useMemo(() => {
        const activeHives = hives.filter(
            (hive) => hive.active && typeof hive.health === 'number',
        );

        if (!activeHives.length) return null;

        const averageValue =
            activeHives.reduce((sum, hive) => sum + hive.health, 0) /
            activeHives.length;

        return Math.round(averageValue);
    }, [hives]);

    const renderValue = (value, formatter) => {
        if (loading) return <span className="placeholder">Chargement...</span>;
        if (error) return <span className="placeholder error">--</span>;
        if (value === null || value === undefined)
            return <span className="placeholder muted">N/A</span>;

        return formatter ? formatter(value) : value;
    };

    const healthLabel = (value) => {
        if (value >= 85) return 'Excellente';
        if (value >= 70) return 'Bonne';
        if (value >= 50) return 'Fragile';
        return 'Critique';
    };

    return (
        <div className="dashboard">
            <section className="hero-card" aria-label="Mise en avant apicole">
                <div className="hero-content">
                    <p className="eyebrow">Ruche Expert · Inspiration terrain</p>
                    <h2>Prendre soin de chaque colonie</h2>
                    <p className="hero-subtitle">
                        Un cockpit visuel pour suivre la santé des ruches et célébrer le travail des abeilles.
                    </p>
                    <div className="hero-tags">
                        <span>Pollinisation</span>
                        <span>Couvain</span>
                        <span>Miellée</span>
                    </div>
                </div>
                <div className="hero-visual" role="img" aria-label="Abeilles sur un cadre de ruche">
                    <img src={heroImage} alt="Cadre de ruche avec abeilles" loading="lazy" />
                </div>
            </section>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🐝</div>
                    <div>
                        <h3>Ruches Actives</h3>
                        <p className="value">12</p>
                        <p className="stat-caption">Butineuses observées cette semaine</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🌿</div>
                    <div>
                        <h3>Visites ce mois</h3>
                        <p className="value">5</p>
                        <p className="stat-caption">Inspections planifiées et réalisées</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🍯</div>
                    <div>
                        <h3>Santé Globale</h3>
                        <p className="value good">Bonne</p>
                        <p className="stat-caption">Indice sur la vitalité des colonies</p>
                    </div>
                </div>
            </div>

            <section className="gallery" aria-label="Références visuelles apicoles">
                <div className="section-header">
                    <div>
                        <p className="eyebrow">Galerie</p>
                        <h3>Des images qui racontent la ruche</h3>
                    </div>
                    <p className="section-subtitle">
                        Inspirez-vous des gestes apicoles et des moments clés à surveiller lors des inspections.
                    </p>
                </div>
                <div className="gallery-grid">
                    {galleryItems.map((item) => (
                        <article className="gallery-card" key={item.title}>
                            <div className="gallery-image">
                                <img src={item.image} alt={item.title} loading="lazy" />
                            </div>
                            <div className="gallery-body">
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                            </div>
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
