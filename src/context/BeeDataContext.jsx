import React, { createContext, useContext, useMemo, useState } from 'react'
import {
    apiaries as initialApiaries,
    equipment as initialEquipment,
    harvests as initialHarvests,
    hives as initialHives,
    visits as initialVisits,
} from '../data/mockData'

const BeeDataContext = createContext()

export const BeeDataProvider = ({ children }) => {
    const [apiaries, setApiaries] = useState(initialApiaries)
    const [hiveList, setHiveList] = useState(initialHives)
    const [visitList, setVisitList] = useState(initialVisits)
    const [harvestList, setHarvestList] = useState(initialHarvests)
    const [equipment, setEquipment] = useState(initialEquipment)
    const [status, setStatus] = useState('idle')
    const [error, setError] = useState(null)

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

    const updateEquipmentStock = (id, delta) => {
        setEquipment((prev) =>
            prev.map((item) => (item.id === id ? { ...item, inStock: Math.max(0, item.inStock + delta) } : item)),
        )
    }

    const updateEquipment = (id, updates) => {
        setEquipment((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
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
        metrics,
        status,
        error,
        resetStatus: () => setStatus('idle'),
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
