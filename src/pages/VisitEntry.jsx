import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const visitSchema = z.object({
    date: z.string().min(1, 'La date de visite est requise'),
    hiveId: z.string().min(1, 'Veuillez sélectionner une ruche'),
    weight: z.coerce.number({
        invalid_type_error: 'Le poids doit être un nombre',
    }).min(0, 'Le poids doit être positif').max(200, 'Poids inattendu pour une ruche'),
    strength: z.enum(['faible', 'moyenne', 'forte'], {
        errorMap: () => ({ message: 'Veuillez préciser la force de la colonie' }),
    }),
    broodStatus: z.enum(['pauvre', 'correct', 'riche'], {
        errorMap: () => ({ message: 'Veuillez indiquer l\'état du couvain' }),
    }),
    weather: z.string().min(1, 'La météo doit être renseignée'),
    notes: z.string().max(500, '500 caractères maximum').optional().or(z.literal('')),
    treatment: z.string().max(200, '200 caractères maximum').optional().or(z.literal('')),
});

const VisitEntry = () => {
    const [hives, setHives] = useState([]);
    const [hivesLoading, setHivesLoading] = useState(true);
    const [hiveFetchError, setHiveFetchError] = useState('');
    const [newHiveName, setNewHiveName] = useState('');
    const [toast, setToast] = useState(null);
    const [apiStatus, setApiStatus] = useState('idle');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        getValues,
    } = useForm({
        resolver: zodResolver(visitSchema),
        defaultValues: {
            date: '',
            hiveId: '',
            weight: '',
            strength: '',
            broodStatus: '',
            weather: '',
            notes: '',
            treatment: '',
        },
    });

    const strengthOptions = useMemo(
        () => [
            { value: 'faible', label: 'Faible' },
            { value: 'moyenne', label: 'Moyenne' },
            { value: 'forte', label: 'Forte' },
        ],
        [],
    );

    const broodOptions = useMemo(
        () => [
            { value: 'pauvre', label: 'Pauvre' },
            { value: 'correct', label: 'Correct' },
            { value: 'riche', label: 'Riche' },
        ],
        [],
    );

    useEffect(() => {
        setHivesLoading(true);
        const timer = setTimeout(() => {
            try {
                setHives([
                    { id: 'ruche-1', name: 'Ruche #1' },
                    { id: 'ruche-2', name: 'Ruche #2' },
                    { id: 'ruche-3', name: 'Ruche #3' },
                ]);
                setHiveFetchError('');
            } catch (error) {
                setHiveFetchError('Impossible de charger les ruches');
            } finally {
                setHivesLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, []);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const mockSubmit = (payload) => new Promise((resolve) => setTimeout(() => resolve(payload), 1200));

    const onSubmit = async (formData) => {
        setApiStatus('loading');
        try {
            await mockSubmit(formData);
            setApiStatus('success');
            showToast('Visite enregistrée avec succès', 'success');
            reset();
        } catch (error) {
            setApiStatus('error');
            showToast('Une erreur est survenue lors de l\'enregistrement', 'error');
        }
    };

    const handleAddHive = () => {
        if (!newHiveName.trim()) {
            showToast('Le nom de la ruche est requis', 'error');
            return;
        }

        const newHive = { id: `ruche-${Date.now()}`, name: newHiveName.trim() };
        setHives((current) => [...current, newHive]);
        const currentValues = getValues();
        reset({ ...currentValues, hiveId: newHive.id });
        setNewHiveName('');
        showToast('Ruche ajoutée à la volée', 'success');
    };

    const isLoading = apiStatus === 'loading' || isSubmitting;

    return (
        <div className="visit-entry">
            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
            <form className="visit-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-group">
                    <label htmlFor="date">Date de visite</label>
                    <input
                        id="date"
                        type="date"
                        {...register('date')}
                        className={errors.date ? 'input-error' : ''}
                        aria-invalid={!!errors.date}
                    />
                    {errors.date && <p className="field-error">{errors.date.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="hive">Ruche</label>
                    <select
                        id="hive"
                        {...register('hiveId')}
                        disabled={hivesLoading}
                        className={errors.hiveId ? 'input-error' : ''}
                        aria-invalid={!!errors.hiveId}
                    >
                        <option value="">Sélectionnez une ruche</option>
                        {hives.map((hive) => (
                            <option key={hive.id} value={hive.id}>
                                {hive.name}
                            </option>
                        ))}
                    </select>
                    {hivesLoading && <p className="muted">Chargement des ruches...</p>}
                    {hiveFetchError && <p className="field-error">{hiveFetchError}</p>}
                    {errors.hiveId && <p className="field-error">{errors.hiveId.message}</p>}
                    <div className="quick-add">
                        <input
                            type="text"
                            placeholder="Ajouter une ruche"
                            value={newHiveName}
                            onChange={(event) => setNewHiveName(event.target.value)}
                        />
                        <button type="button" onClick={handleAddHive} className="btn-secondary">
                            Ajouter
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="weight">Poids de la ruche (kg)</label>
                    <input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder="Ex: 35.5"
                        {...register('weight')}
                        className={errors.weight ? 'input-error' : ''}
                        aria-invalid={!!errors.weight}
                    />
                    {errors.weight && <p className="field-error">{errors.weight.message}</p>}
                </div>

                <div className="form-inline">
                    <div className="form-group">
                        <label htmlFor="strength">Force de la colonie</label>
                        <select
                            id="strength"
                            {...register('strength')}
                            className={errors.strength ? 'input-error' : ''}
                            aria-invalid={!!errors.strength}
                        >
                            <option value="">Sélectionnez</option>
                            {strengthOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.strength && <p className="field-error">{errors.strength.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="broodStatus">État du couvain</label>
                        <select
                            id="broodStatus"
                            {...register('broodStatus')}
                            className={errors.broodStatus ? 'input-error' : ''}
                            aria-invalid={!!errors.broodStatus}
                        >
                            <option value="">Sélectionnez</option>
                            {broodOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.broodStatus && <p className="field-error">{errors.broodStatus.message}</p>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="weather">Météo</label>
                    <input
                        id="weather"
                        type="text"
                        placeholder="Ensoleillé, pluie, vent..."
                        {...register('weather')}
                        className={errors.weather ? 'input-error' : ''}
                        aria-invalid={!!errors.weather}
                    />
                    {errors.weather && <p className="field-error">{errors.weather.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Remarques</label>
                    <textarea
                        id="notes"
                        rows="3"
                        placeholder="Observations générales"
                        {...register('notes')}
                        className={errors.notes ? 'input-error' : ''}
                        aria-invalid={!!errors.notes}
                    />
                    {errors.notes && <p className="field-error">{errors.notes.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="treatment">Traitement éventuel</label>
                    <input
                        id="treatment"
                        type="text"
                        placeholder="Ex: Acide formique"
                        {...register('treatment')}
                        className={errors.treatment ? 'input-error' : ''}
                        aria-invalid={!!errors.treatment}
                    />
                    {errors.treatment && <p className="field-error">{errors.treatment.message}</p>}
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Enregistrement...' : 'Enregistrer la visite'}
                    </button>
                    {apiStatus === 'success' && <span className="status success">Enregistré</span>}
                    {apiStatus === 'error' && <span className="status error">Erreur lors de l\'envoi</span>}
                </div>
            </form>
        </div>
    );
};

export default VisitEntry;
