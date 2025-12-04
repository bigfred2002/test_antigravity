import React, { useEffect } from 'react';
import useApiStore from '../store/useApiStore';

const VisitEntry = () => {
    const { hives, loading, error, fetchData } = useApiStore((state) => ({
        hives: state.hives,
        loading: state.loading,
        error: state.error,
        fetchData: state.fetchData,
    }));

    useEffect(() => {
        if (!hives.length && !loading && !error) {
            fetchData();
        }
    }, [fetchData, hives.length, loading, error]);

    return (
        <div className="visit-entry">
            <form className="visit-form">
                <div className="form-group">
                    <label>Date de visite</label>
                    <input type="date" />
                </div>
                <div className="form-group">
                    <label>Ruche</label>
                    <select disabled={loading || !!error || !hives.length}>
                        {loading && <option>Chargement...</option>}
                        {error && <option>Ruches indisponibles</option>}
                        {!loading && !error && !hives.length && (
                            <option>Aucune ruche disponible</option>
                        )}
                        {!loading && !error &&
                            hives.map((hive) => (
                                <option key={hive.id} value={hive.id}>
                                    {hive.name}
                                </option>
                            ))}
                    </select>
                </div>
                <button type="submit" className="btn-primary">
                    Enregistrer
                </button>
            </form>
        </div>
    );
};

export default VisitEntry;
