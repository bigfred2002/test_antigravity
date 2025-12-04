import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Boxes, ClipboardList, Droplets, LayoutDashboard, MapPinned, Notebook, PackageOpen } from 'lucide-react';

const Layout = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const titles = {
        '/': 'Tableau de bord',
        '/visit': 'Nouvelle Visite',
        '/apiary': 'Fiche rucher',
        '/hives': 'Définition des ruches',
        '/harvest': 'Récoltes',
        '/inventory': 'Inventaire',
        '/records': 'Consultation',
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="logo">
                    <h1>Ruche Expert</h1>
                </div>
                <nav>
                    <Link
                        to="/"
                        className={`nav-item ${isActive('/') ? 'active' : ''}`}
                        aria-current={isActive('/') ? 'page' : undefined}
                    >
                        <LayoutDashboard size={20} />
                        <span>Tableau de bord</span>
                    </Link>
                    <Link
                        to="/visit"
                        className={`nav-item ${isActive('/visit') ? 'active' : ''}`}
                        aria-current={isActive('/visit') ? 'page' : undefined}
                    >
                        <ClipboardList size={20} />
                        <span>Saisie Visite</span>
                    </Link>
                    <Link
                        to="/apiary"
                        className={`nav-item ${isActive('/apiary') ? 'active' : ''}`}
                        aria-current={isActive('/apiary') ? 'page' : undefined}
                    >
                        <MapPinned size={20} />
                        <span>Définir le rucher</span>
                    </Link>
                    <Link
                        to="/hives"
                        className={`nav-item ${isActive('/hives') ? 'active' : ''}`}
                        aria-current={isActive('/hives') ? 'page' : undefined}
                    >
                        <Boxes size={20} />
                        <span>Ruches</span>
                    </Link>
                    <Link
                        to="/harvest"
                        className={`nav-item ${isActive('/harvest') ? 'active' : ''}`}
                        aria-current={isActive('/harvest') ? 'page' : undefined}
                    >
                        <Droplets size={20} />
                        <span>Récoltes</span>
                    </Link>
                    <Link
                        to="/inventory"
                        className={`nav-item ${isActive('/inventory') ? 'active' : ''}`}
                        aria-current={isActive('/inventory') ? 'page' : undefined}
                    >
                        <PackageOpen size={20} />
                        <span>Inventaire</span>
                    </Link>
                    <Link
                        to="/records"
                        className={`nav-item ${isActive('/records') ? 'active' : ''}`}
                        aria-current={isActive('/records') ? 'page' : undefined}
                    >
                        <Notebook size={20} />
                        <span>Consultation</span>
                    </Link>
                </nav>
            </aside>
            <main className="content">
                <header className="top-bar">
                    <h2>{titles[location.pathname] || 'Carnet apicole'}</h2>
                    <div className="user-profile">
                        <div className="avatar">JD</div>
                    </div>
                </header>
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
