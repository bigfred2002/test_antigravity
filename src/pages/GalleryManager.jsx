import React, { useState } from 'react'
import { ImagePlus, Images } from 'lucide-react'
import { useBeeData } from '../context/BeeDataContext'

const GalleryManager = () => {
    const { knowledge, addGalleryItem, removeGalleryItem } = useBeeData()
    const [entry, setEntry] = useState({ title: '', description: '', image: '' })

    const addEntry = (event) => {
        event.preventDefault()
        if (!entry.title || !entry.image) return
        addGalleryItem(entry)
        setEntry({ title: '', description: '', image: '' })
    }

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (loadEvent) => {
            const dataUrl = loadEvent.target?.result
            if (typeof dataUrl === 'string') {
                setEntry((prev) => ({ ...prev, image: dataUrl }))
            }
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Administration · Galerie</p>
                    <h3>Gestion de la galerie</h3>
                    <p className="panel-caption">
                        Ajoutez des photos de vos ruchers, visites ou récoltes pour garder un historique visuel.
                    </p>
                </div>
                <div className="pill">{knowledge.gallery.length} entrée(s)</div>
            </header>

            <section className="panel">
                <div className="definition-grid">
                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Ajouter une entrée</h4>
                            <ImagePlus size={18} />
                        </div>
                        <form className="definition-form compact" onSubmit={addEntry}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Titre"
                                value={entry.title}
                                onChange={(event) => setEntry((prev) => ({ ...prev, title: event.target.value }))}
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={entry.description}
                                onChange={(event) => setEntry((prev) => ({ ...prev, description: event.target.value }))}
                            />
                            <label className="form-field" htmlFor="galleryUpload">
                                <span>Image (URL ou fichier)</span>
                                <div className="upload-inline">
                                    <input
                                        type="url"
                                        name="image"
                                        placeholder="https://..."
                                        value={entry.image.startsWith('data:') ? '' : entry.image}
                                        onChange={(event) => setEntry((prev) => ({ ...prev, image: event.target.value }))}
                                    />
                                    <input id="galleryUpload" type="file" accept="image/*" onChange={handleImageUpload} />
                                </div>
                            </label>
                            <button type="submit" className="btn-primary">
                                Enregistrer
                            </button>
                        </form>
                    </article>

                    <article className="definition-card">
                        <div className="card-header">
                            <h4>Galerie actuelle</h4>
                            <Images size={18} />
                        </div>
                        <div className="highlight-grid">
                            {knowledge.gallery.map((item) => (
                                <article key={item.id} className="highlight-card" aria-label={item.title}>
                                    <div className="highlight-image">
                                        <img src={item.image} alt={item.title} loading="lazy" />
                                    </div>
                                    <div className="highlight-body">
                                        <h4>{item.title}</h4>
                                        <p>{item.description}</p>
                                        <button
                                            type="button"
                                            className="btn-ghost"
                                            onClick={() => removeGalleryItem(item.id)}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                        {!knowledge.gallery.length && <p className="muted">Aucune photo enregistrée.</p>}
                    </article>
                </div>
            </section>
        </div>
    )
}

export default GalleryManager
