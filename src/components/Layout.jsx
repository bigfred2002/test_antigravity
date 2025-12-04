import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
    BookOpenCheck,
    Boxes,
    ClipboardList,
    Droplets,
    FolderCog,
    HardDriveDownload,
    LayoutDashboard,
    MapPinned,
    Notebook,
    PackageOpen,
    Wrench,
} from 'lucide-react'

const Layout = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const titles = {
        '/': 'Tableau de bord',
        '/visit': 'Visites',
        '/apiary': 'Fiche rucher',
        '/hives': 'Définition des ruches',
        '/harvest': 'Récoltes',
        '/inventory': 'Inventaire',
        '/records': 'Consultation',
        '/equipment-entry': 'Saisie matériel',
        '/equipment-edit': 'Modification matériel',
        '/administration': 'Administration',
        '/knowledge': 'Base de connaissance',
    }

    const menuSections = [
        {
            label: 'Accueil',
            items: [
                { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
                { to: '/records', icon: Notebook, label: 'Consultation' },
            ],
        },
        {
            label: 'Gestion du rucher',
            items: [
                { to: '/hives', icon: Boxes, label: 'Ruches' },
                { to: '/apiary', icon: MapPinned, label: 'Rucher' },
            ],
        },
        {
            label: 'Vie du rucher',
            items: [
                { to: '/visit', icon: ClipboardList, label: 'Visites' },
                { to: '/harvest', icon: Droplets, label: 'Récoltes' },
            ],
        },
        {
            label: 'Matériel apiculture',
            items: [
                { to: '/equipment-entry', icon: PackageOpen, label: 'Saisie' },
                { to: '/equipment-edit', icon: Wrench, label: 'Modification' },
                { to: '/inventory', icon: FolderCog, label: 'Inventaire' },
            ],
        },
        {
            label: 'Administration',
            items: [{ to: '/administration', icon: HardDriveDownload, label: 'Sauvegardes & rapports' }],
        },
        {
            label: 'Base de connaissance',
            items: [{ to: '/knowledge', icon: BookOpenCheck, label: 'Contacts & docs' }],
        },
    ]

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="logo">
                    <h1>Ruche Expert</h1>
                </div>
                <nav>
                    {menuSections.map((section) => (
                        <div key={section.label} className="nav-section">
                            <p className="nav-label">{section.label}</p>
                            {section.items.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={`nav-item ${isActive(item.to) ? 'active' : ''}`}
                                        aria-current={isActive(item.to) ? 'page' : undefined}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    ))}
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
