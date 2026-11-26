import PhotoCard from '../components/PhotoCard'
import { photos } from '../data/photos'

export default function GalleryPage() {
  return (
    <section aria-labelledby="gallery-heading">
      <p className="eyebrow">
        PHOTO COLLECTION / 01
      </p>

      <h1 id="gallery-heading">
        Explore the gallery
      </h1>

      <p className="page-description">
        A curated collection of demonstration images.
      </p>

      <p className="photo-count">
        {photos.length} images
      </p>

      {photos.length === 0 ? (
        <p>No images are available.</p>
      ) : (
        <div className="photo-grid">
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              priority={index === 0}
            />
          ))}
        </div>
      )}
    </section>
  )
}