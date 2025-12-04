import React from 'react';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Ruches Actives</h3>
                    <p className="value">12</p>
                </div>
                <div className="stat-card">
                    <h3>Visites ce mois</h3>
                    <p className="value">5</p>
                </div>
                <div className="stat-card">
                    <h3>Santé Globale</h3>
                    <p className="value good">Bonne</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
