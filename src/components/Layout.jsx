import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    BookOpen,
    BookOpenCheck,
    Boxes,
    ClipboardList,
    ChevronDown,
    Droplets,
    ExternalLink,
    FolderCog,
    HardDriveDownload,
    Image,
    LayoutDashboard,
    MapPinned,
    Notebook,
    Phone,
    PackageOpen,
    Scale,
    Wrench,
} from 'lucide-react'

const Layout = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { currentUser, logout } = useAuth()
    const [openSections, setOpenSections] = useState(() => new Set(['home', 'beeyard']))
    const [openGroups, setOpenGroups] = useState(() => new Set())

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`)

    const titles = {
        '/': 'Tableau de bord',
        '/visit': 'Visites',
        '/visits': 'Suivi des visites',
        '/apiary': 'Fiche rucher',
        '/hives': 'Définition des ruches',
        '/hives/review': 'Suivi des ruches',
        '/harvest': 'Récolte de miel',
        '/harvest/inventory': 'Inventaires miel',
        '/harvest/movements': 'Mouvements de miel',
        '/inventory': 'Inventaire',
        '/records': 'Résumé rucher',
        '/equipment-entry': 'Saisie matériel',
        '/equipment-edit': 'Modification matériel',
        '/administration': 'Administration',
        '/knowledge': 'Base de connaissance',
        '/knowledge/contacts': 'Contacts apicoles',
        '/knowledge/sites': 'Sites utiles',
        '/knowledge/documents': 'Documents',
        '/gallery': 'Galeries',
        '/administration/knowledge/contacts': 'Gestion des contacts',
        '/administration/knowledge/sites': 'Gestion des sites web',
        '/administration/knowledge/documents': 'Gestion des documents',
        '/administration/gallery': 'Gestion de la galerie',
        '/administration/knowledge': 'Mise à jour de la base de connaissance',
    }

    const menuSections = useMemo(
        () => [
            {
                key: 'home',
                label: 'Accueil',
                items: [
                    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
                    { to: '/records', icon: Notebook, label: 'Résumé rucher' },
                ],
            },
            {
                key: 'beeyard',
                label: 'Vie du rucher',
                groups: [
                    {
                        key: 'visits',
                        label: 'Visites',
                        items: [
                            { to: '/visit', icon: ClipboardList, label: 'Saisie visites' },
                            { to: '/visits', icon: Notebook, label: 'Suivi visites' },
                        ],
                    },
                    {
                        key: 'harvests',
                        label: 'Récoltes',
                        items: [
                            { to: '/harvest', icon: Droplets, label: 'Récolte de miel' },
                            { to: '/harvest/inventory', icon: PackageOpen, label: 'Inventaires miel' },
                            { to: '/harvest/movements', icon: Scale, label: 'Mouvements' },
                        ],
                    },
                    {
                        key: 'apiary',
                        label: 'Rucher',
                        items: [
                            { to: '/apiary', icon: MapPinned, label: 'Fiche rucher' },
                            { to: '/hives', icon: Boxes, label: 'Création ruches' },
                            { to: '/hives/review', icon: Wrench, label: 'Suivi ruches' },
                        ],
                    },
                ],
            },
            {
                key: 'equipment',
                label: 'Matériel apiculture',
                items: [
                    { to: '/equipment-entry', icon: PackageOpen, label: 'Saisie' },
                    { to: '/equipment-edit', icon: Wrench, label: 'Modification' },
                    { to: '/inventory', icon: FolderCog, label: 'Inventaire' },
                ],
            },
            {
                key: 'resources',
                label: 'Ressources',
                groups: [
                    {
                        key: 'knowledge-base',
                        label: 'Base de connaissance',
                        items: [
                            { to: '/knowledge/contacts', icon: Phone, label: 'Contacts' },
                            { to: '/knowledge/sites', icon: ExternalLink, label: 'Sites web' },
                            { to: '/knowledge/documents', icon: BookOpen, label: 'Documents' },
                        ],
                    },
                    {
                        key: 'gallery',
                        label: 'Galeries',
                        items: [{ to: '/gallery', icon: Image, label: 'Galeries visuelles' }],
                    },
                ],
            },
            {
                key: 'admin',
                label: 'Administration',
                groups: [
                    {
                        key: 'admin-data',
                        label: 'Base de données',
                        items: [{ to: '/administration', icon: HardDriveDownload, label: 'Sauvegardes & rapports' }],
                    },
                    {
                        key: 'admin-knowledge',
                        label: 'Base de connaissance',
                        items: [
                            { to: '/administration/knowledge/contacts', icon: Phone, label: 'Contacts' },
                            { to: '/administration/knowledge/sites', icon: ExternalLink, label: 'Sites web' },
                            { to: '/administration/knowledge/documents', icon: BookOpen, label: 'Documents' },
                            { to: '/administration/gallery', icon: Image, label: 'Gestion galerie' },
                        ],
                    },
                ],
            },
        ],
        [],
    )

    useEffect(() => {
        const nextSections = new Set(openSections)
        const nextGroups = new Set(openGroups)
        menuSections.forEach((section) => {
            const allItems = section.groups ? section.groups.flatMap((group) => group.items) : section.items
            if (allItems.some((item) => isActive(item.to))) {
                nextSections.add(section.key)
            }
            if (section.groups) {
                section.groups.forEach((group) => {
                    if (group.items.some((item) => isActive(item.to))) {
                        nextGroups.add(group.key)
                    }
                })
            }
        })
        setOpenSections(new Set(nextSections))
        setOpenGroups(new Set(nextGroups))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    const toggleSection = (key) => {
        setOpenSections((prev) => {
            const next = new Set(prev)
            if (next.has(key)) {
                next.delete(key)
            } else {
                next.add(key)
            }
            return next
        })
    }

    const toggleGroup = (key) => {
        setOpenGroups((prev) => {
            const next = new Set(prev)
            if (next.has(key)) {
                next.delete(key)
            } else {
                next.add(key)
            }
            return next
        })
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const currentTitle =
        titles[location.pathname] ||
        (location.pathname.startsWith('/visits/')
            ? 'Fiche de visite'
            : location.pathname.startsWith('/harvest/')
              ? 'Récoltes'
              : 'Carnet apicole')

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="logo">
                    <h1>Ruche Expert</h1>
                </div>
                <nav>
                    {menuSections.map((section) => (
                        <div key={section.key} className="nav-section">
                            <button
                                type="button"
                                className="nav-label nav-toggle"
                                onClick={() => toggleSection(section.key)}
                                aria-expanded={openSections.has(section.key)}
                            >
                                <span>{section.label}</span>
                                <ChevronDown size={16} className={openSections.has(section.key) ? 'rotated' : ''} />
                            </button>
                            {section.groups && openSections.has(section.key) &&
                                section.groups.map((group) => (
                                    <div key={group.key} className="nav-subsection">
                                        <button
                                            type="button"
                                            className="nav-subtoggle"
                                            onClick={() => toggleGroup(group.key)}
                                            aria-expanded={openGroups.has(group.key)}
                                        >
                                            <span>{group.label}</span>
                                            <ChevronDown size={14} className={openGroups.has(group.key) ? 'rotated' : ''} />
                                        </button>
                                        {openGroups.has(group.key) &&
                                            group.items.map((item) => {
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
                            {!section.groups && openSections.has(section.key) &&
                                section.items.map((item) => {
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
                    <h2>{currentTitle}</h2>
                    <div className="user-profile" aria-label="Profil utilisateur">
                        {currentUser && (
                            <>
                                <div className="user-meta">
                                    <p className="muted small">Compte apiculteur</p>
                                    <p className="user-name">{currentUser.name}</p>
                                </div>
                                <div className="avatar">{currentUser.avatar || 'AP'}</div>
                                <button className="pill" type="button" onClick={handleLogout}>
                                    Se déconnecter
                                </button>
                            </>
                        )}
                    </div>
                </header>
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default Layout
