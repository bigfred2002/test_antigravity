import React, { createContext, useContext, useMemo, useState } from 'react'
import { hives as initialHives, visits as initialVisits } from '../data/mockData'

const BeeDataContext = createContext()

export const BeeDataProvider = ({ children }) => {
    const [hiveList, setHiveList] = useState(initialHives)
    const [visitList, setVisitList] = useState(initialVisits)
    const [status, setStatus] = useState('idle')
    const [error, setError] = useState(null)

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

        const health = avgWeight >= 34 ? 'Excellente' : avgWeight >= 30 ? 'Bonne' : 'À surveiller'

        return { activeHives, visitsLast30Days, health, avgWeight }
    }, [hiveList, visitList])

    const value = {
        hives: hiveList,
        visits: visitList,
        addVisit,
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
