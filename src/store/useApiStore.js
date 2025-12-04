import { create } from 'zustand';

const mockHives = [
    { id: 'hive-1', name: 'Ruche #1', active: true, health: 86 },
    { id: 'hive-2', name: 'Ruche #2', active: true, health: 78 },
    { id: 'hive-3', name: 'Ruche #3', active: false, health: 0 },
    { id: 'hive-4', name: 'Ruche #4', active: true, health: 91 },
    { id: 'hive-5', name: 'Ruche #5', active: true, health: 73 },
];

const mockVisits = [
    { id: 'visit-1', hiveId: 'hive-1', date: '2025-02-05', notes: 'Contrôle général' },
    { id: 'visit-2', hiveId: 'hive-2', date: '2025-01-20', notes: 'Nourrissement' },
    { id: 'visit-3', hiveId: 'hive-4', date: '2025-01-28', notes: 'Vérification reine' },
    { id: 'visit-4', hiveId: 'hive-1', date: '2025-01-10', notes: 'Traitement varroa' },
    { id: 'visit-5', hiveId: 'hive-5', date: '2024-12-30', notes: 'Contrôle hivernal' },
];

const fetchMockData = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                hives: mockHives,
                visits: mockVisits,
            });
        }, 350);
    });

const useApiStore = create((set, get) => ({
    hives: [],
    visits: [],
    loading: false,
    error: null,
    async fetchData() {
        if (get().loading) return;

        set({ loading: true, error: null });
        try {
            const { hives, visits } = await fetchMockData();
            set({ hives, visits, loading: false });
        } catch (error) {
            set({ error: "Impossible de charger les données", loading: false });
        }
    },
}));

export default useApiStore;
