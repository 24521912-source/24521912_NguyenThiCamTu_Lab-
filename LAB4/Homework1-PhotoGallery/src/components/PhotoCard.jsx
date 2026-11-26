export default function PhotoCard({
  photo,
  priority = false,
  onOpen,
}) {
  return (
    <article className="photo-card">
      <button
        type="button"
        className="photo-trigger"
        aria-label={`View ${photo.title}`}
        onClick={(event) =>
          onOpen(photo.id, event.currentTarget)
        }
      >
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading={priority ? 'eager' : 'lazy'}
        />
      </button>

      <div className="photo-card-content">
        <h2>{photo.title}</h2>

        <p className="photo-category">
          {photo.category}
        </p>
      </div>
    </article>
  )
}