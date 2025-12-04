import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import {
    apiaries as initialApiaries,
    equipment as initialEquipment,
    harvests as initialHarvests,
    hives as initialHives,
    knowledgeBase as initialKnowledge,
    visits as initialVisits,
} from '../data/mockData'

const BeeDataContext = createContext()
const STORAGE_PREFIX = 'bee-data-store'

const normalizeWithIds = (items, prefix) =>
    (items || []).map((item, index) => {
        if (typeof item === 'string') {
            return { id: `${prefix}-${index}`, name: item, detail: '' }
        }
        return item.id ? item : { ...item, id: `${prefix}-${index}` }
    })

const normalizeDocuments = (documents) =>
    (documents || []).map((doc, index) => {
        if (typeof doc === 'string') {
            return { id: `doc-${index}`, name: doc, uploadedAt: new Date().toISOString().slice(0, 10) }
        }
        return { ...doc, id: doc.id || `doc-${index}` }
    })

const normalizeKnowledge = (knowledge) => ({
    contacts: normalizeWithIds(knowledge?.contacts, 'contact'),
    sites: normalizeWithIds(knowledge?.sites, 'site'),
    documents: normalizeDocuments(knowledge?.documents),
})

const normalizedInitialKnowledge = normalizeKnowledge(initialKnowledge)

const defaultEmptyData = {
    apiaries: [],
    hives: [],
    visits: [],
    harvests: [],
    equipment: [],
    knowledge: normalizedInitialKnowledge,
    movements: [],
}

const seededData = {
    apiaries: initialApiaries,
    hives: initialHives,
    visits: initialVisits,
    harvests: initialHarvests,
    equipment: initialEquipment,
    knowledge: normalizedInitialKnowledge,
    movements: [],
}

const getStorageKey = (userId) => `${STORAGE_PREFIX}-${userId}`

const getPersistedData = (userId) => {
    if (!userId || typeof window === 'undefined' || typeof localStorage === 'undefined') return null

    try {
        const raw = localStorage.getItem(getStorageKey(userId))
        return raw ? JSON.parse(raw) : null
    } catch (error) {
        console.warn('Impossible de charger les données locales', error)
        return null
    }
}

const getWithFallback = (persisted, key, fallback) => {
    if (!persisted) return fallback
    const value = persisted[key]
    if (Array.isArray(fallback)) return Array.isArray(value) ? value : fallback
    if (typeof fallback === 'object' && fallback !== null) return typeof value === 'object' && value ? value : fallback
    return value ?? fallback
}

export const BeeDataProvider = ({ children }) => {
    const { currentUser } = useAuth()
    const [apiaries, setApiaries] = useState(defaultEmptyData.apiaries)
    const [hiveList, setHiveList] = useState(defaultEmptyData.hives)
    const [visitList, setVisitList] = useState(defaultEmptyData.visits)
    const [harvestList, setHarvestList] = useState(defaultEmptyData.harvests)
    const [equipment, setEquipment] = useState(defaultEmptyData.equipment)
    const [knowledge, setKnowledge] = useState(defaultEmptyData.knowledge)
    const [movements, setMovements] = useState(defaultEmptyData.movements)
    const [status, setStatus] = useState('idle')
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!currentUser) {
            setApiaries(defaultEmptyData.apiaries)
            setHiveList(defaultEmptyData.hives)
            setVisitList(defaultEmptyData.visits)
            setHarvestList(defaultEmptyData.harvests)
            setEquipment(defaultEmptyData.equipment)
            setKnowledge(normalizeKnowledge(defaultEmptyData.knowledge))
            setMovements(defaultEmptyData.movements)
            return
        }

        const persisted = getPersistedData(currentUser.id)
        const baseData = currentUser.id === 'demo' ? seededData : defaultEmptyData

        setApiaries(getWithFallback(persisted, 'apiaries', baseData.apiaries))
        setHiveList(getWithFallback(persisted, 'hives', baseData.hives))
        setVisitList(getWithFallback(persisted, 'visits', baseData.visits))
        setHarvestList(getWithFallback(persisted, 'harvests', baseData.harvests))
        setEquipment(getWithFallback(persisted, 'equipment', baseData.equipment))
        setKnowledge(normalizeKnowledge(getWithFallback(persisted, 'knowledge', baseData.knowledge)))
        setMovements(getWithFallback(persisted, 'movements', baseData.movements))
    }, [currentUser])

    useEffect(() => {
        if (!currentUser || typeof window === 'undefined' || typeof localStorage === 'undefined') return

        const payload = {
            apiaries,
            hives: hiveList,
            visits: visitList,
            harvests: harvestList,
            equipment,
            knowledge,
            movements,
        }

        localStorage.setItem(getStorageKey(currentUser.id), JSON.stringify(payload))
    }, [apiaries, hiveList, visitList, harvestList, equipment, knowledge, movements, currentUser])

    const addApiary = (payload) => {
        const newApiary = { id: `apiary-${Date.now()}`, ...payload }
        setApiaries((prev) => [...prev, newApiary])
        return newApiary
    }

    const updateApiary = (id, updates) => {
        setApiaries((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
    }

    const addHive = (payload) => {
        const newHive = {
            id: `hive-${Date.now()}`,
            status: 'active',
            population: 'Moyenne',
            ...payload,
        }
        setHiveList((prev) => [...prev, newHive])
        return newHive
    }

    const updateHive = (id, updates) => {
        setHiveList((prev) => prev.map((hive) => (hive.id === id ? { ...hive, ...updates } : hive)))
    }

    const addVisit = (payload) => {
        setStatus('loading')
        setError(null)
        try {
            const newVisit = { id: `visit-${Date.now()}`, ...payload }
            setVisitList((prev) => [...prev, newVisit])
            setStatus('success')
            return newVisit
        } catch (err) {
            setError('Impossible de sauvegarder la visite, réessayez.')
            setStatus('error')
            return null
        }
    }

    const updateVisit = (id, updates) => {
        setVisitList((prev) => prev.map((visit) => (visit.id === id ? { ...visit, ...updates } : visit)))
    }

    const addHarvest = (payload) => {
        const newHarvest = { id: `harvest-${Date.now()}`, ...payload }
        setHarvestList((prev) => [...prev, newHarvest])
        return newHarvest
    }

    const updateHarvest = (id, updates) => {
        setHarvestList((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
    }

    const addEquipment = (payload) => {
        const newEquipment = { id: `eq-${Date.now()}`, needed: 0, inStock: 0, ...payload }
        setEquipment((prev) => [...prev, newEquipment])
        return newEquipment
    }

    const addMovement = (payload) => {
        const newMovement = { id: `mov-${Date.now()}`, date: new Date().toISOString().slice(0, 10), ...payload }
        setMovements((prev) => [newMovement, ...prev])
        return newMovement
    }

    const updateEquipmentStock = (id, delta) => {
        setEquipment((prev) =>
            prev.map((item) => (item.id === id ? { ...item, inStock: Math.max(0, item.inStock + delta) } : item)),
        )
    }

    const updateEquipment = (id, updates) => {
        setEquipment((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
    }

    const updateKnowledge = (section, updater) => {
        setKnowledge((prev) => {
            const nextSection = typeof updater === 'function' ? updater(prev[section] || []) : updater
            return { ...prev, [section]: nextSection }
        })
    }

    const addKnowledgeDocument = (document) => {
        const payload = {
            id: document.id || `doc-${Date.now()}`,
            uploadedAt: document.uploadedAt || new Date().toISOString().slice(0, 10),
            ...document,
        }
        setKnowledge((prev) => ({ ...prev, documents: [...(prev.documents || []), payload] }))
        return payload
    }

    const removeKnowledgeDocument = (id) => {
        setKnowledge((prev) => ({
            ...prev,
            documents: (prev.documents || []).filter((doc) => doc.id !== id),
        }))
    }

    const metrics = useMemo(() => {
        const activeHives = hiveList.filter((hive) => hive.status !== 'archived').length
        const visitsLast30Days = visitList.filter((visit) => {
            const visitDate = new Date(visit.date)
            const now = new Date()
            const diff = (now - visitDate) / (1000 * 60 * 60 * 24)
            return diff <= 30
        }).length

        const avgWeight = visitList.length
            ? Math.round(visitList.reduce((sum, v) => sum + (v.weight || 0), 0) / visitList.length)
            : 0

        const totalHarvestKg = harvestList.reduce((sum, harvest) => sum + (harvest.quantityKg || 0), 0)

        const health = avgWeight >= 34 ? 'Excellente' : avgWeight >= 30 ? 'Bonne' : 'À surveiller'

        return { activeHives, visitsLast30Days, health, avgWeight, totalHarvestKg }
    }, [hiveList, visitList, harvestList])

    const exportData = () => ({
        apiaries,
        hives: hiveList,
        visits: visitList,
        harvests: harvestList,
        equipment,
        knowledge,
        movements,
    })

    const importData = (snapshot) => {
        if (!snapshot) return

        setApiaries(snapshot.apiaries ?? [])
        setHiveList(snapshot.hives ?? [])
        setVisitList(snapshot.visits ?? [])
        setHarvestList(snapshot.harvests ?? [])
        setEquipment(snapshot.equipment ?? [])
        setKnowledge(normalizeKnowledge(snapshot.knowledge ?? initialKnowledge))
        setMovements(snapshot.movements ?? [])
    }

    const value = {
        apiaries,
        hives: hiveList,
        visits: visitList,
        harvests: harvestList,
        equipment,
        addApiary,
        updateApiary,
        addVisit,
        updateVisit,
        addHive,
        updateHive,
        addHarvest,
        updateHarvest,
        addEquipment,
        updateEquipment,
        updateEquipmentStock,
        movements,
        addMovement,
        metrics,
        knowledge,
        updateKnowledge,
        addKnowledgeDocument,
        removeKnowledgeDocument,
        status,
        error,
        resetStatus: () => setStatus('idle'),
        exportData,
        importData,
    }

    return <BeeDataContext.Provider value={value}>{children}</BeeDataContext.Provider>
}

export const useBeeData = () => {
    const context = useContext(BeeDataContext)
    if (!context) {
        throw new Error('useBeeData must be used within a BeeDataProvider')
    }
    return context
}
