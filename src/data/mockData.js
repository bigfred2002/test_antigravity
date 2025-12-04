export const hives = [
    { id: 'hive-1', name: 'Ruche Tournesol', status: 'active', population: 'Forte' },
    { id: 'hive-2', name: 'Ruche Lavande', status: 'active', population: 'Moyenne' },
    { id: 'hive-3', name: 'Ruche Acacia', status: 'active', population: 'Forte' },
    { id: 'hive-4', name: 'Ruche Châtaigner', status: 'monitor', population: 'À surveiller' },
]

export const visits = [
    {
        id: 'visit-1',
        hiveId: 'hive-1',
        date: '2024-03-15',
        weight: 32,
        broodPattern: 'Compact',
        weather: 'Ensoleillé',
        notes: 'Bonne reprise de ponte, douceur marquée.',
    },
    {
        id: 'visit-2',
        hiveId: 'hive-2',
        date: '2024-03-22',
        weight: 29,
        broodPattern: 'Régulier',
        weather: 'Couvert',
        notes: 'Réserve correcte, prévoir hausse si miellée lavande.',
    },
    {
        id: 'visit-3',
        hiveId: 'hive-3',
        date: '2024-04-03',
        weight: 35,
        broodPattern: 'Très compact',
        weather: 'Clair',
        notes: 'Population dense, vigilance essaimage.',
    },
]
