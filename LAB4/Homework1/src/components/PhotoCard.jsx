export default function PhotoCard({ photo, priority = false }) {
  return (
    <article className="photo-card">
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? 'eager' : 'lazy'}
      />

      <div className="photo-card-content">
        <h2>{photo.title}</h2>

        <p className="photo-category">
          {photo.category}
        </p>
      </div>
    </article>
  )
}