import React, { useEffect, useMemo } from 'react';
import useApiStore from '../store/useApiStore';

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
            {error && (
                <div className="inline-alert">{error}</div>
            )}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Ruches Actives</h3>
                    <p className="value">
                        {renderValue(activeHivesCount)}
                    </p>
                    <p className="hint">Total de ruches suivies</p>
                </div>
                <div className="stat-card">
                    <h3>Visites sur 30 jours</h3>
                    <p className="value">
                        {renderValue(visitsLast30Days)}
                    </p>
                    <p className="hint">Interventions récentes</p>
                </div>
                <div className="stat-card">
                    <h3>Santé moyenne</h3>
                    <p className="value">
                        {renderValue(averageHealth, (value) => `${value}%`)}
                    </p>
                    <p className="hint">
                        {renderValue(
                            averageHealth,
                            (value) => `${healthLabel(value)} santé`,
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
