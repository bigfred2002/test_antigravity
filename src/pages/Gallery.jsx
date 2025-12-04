import React from 'react'
import { Images } from 'lucide-react'
import { useBeeData } from '../context/BeeDataContext'

const Gallery = () => {
    const { knowledge } = useBeeData()
    const gallery = knowledge.gallery || []

    return (
        <div className="definition-page">
            <header className="panel-header">
                <div>
                    <p className="eyebrow">Ressources visuelles</p>
                    <h3>Galeries du rucher</h3>
                    <p className="panel-caption">
                        Centralisez vos photos clés pour raconter l’histoire du rucher et partager vos bonnes pratiques.
                    </p>
                </div>
                <div className="pill">{gallery.length} entrée(s)</div>
            </header>

            <section className="panel">
                <div className="highlight-grid">
                    {gallery.map((item) => (
                        <article key={item.id} className="highlight-card" aria-label={item.title}>
                            <div className="highlight-image">
                                <img src={item.image} alt={item.title} loading="lazy" />
                                <div className="image-chip">Galerie</div>
                            </div>
                            <div className="highlight-body">
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
                {!gallery.length && (
                    <div className="empty">
                        <Images size={18} /> Aucune image ajoutée pour le moment.
                    </div>
                )}
            </section>
        </div>
    )
}

export default Gallery
