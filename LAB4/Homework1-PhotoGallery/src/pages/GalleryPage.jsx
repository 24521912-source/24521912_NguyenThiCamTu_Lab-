import { useSearchParams } from 'react-router'
import PhotoCard from '../components/PhotoCard'
import CategoryFilter from '../components/CategoryFilter'
import { photos } from '../data/photos'
import {
  normalizeCategory,
  filterPhotos,
} from '../data/categories'
import '../styles/category-filter.css'

export default function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeCategory = normalizeCategory(
    searchParams.get('category'),
  )

  const filteredPhotos = filterPhotos(
    photos,
    activeCategory,
  )

  function handleCategoryChange(category) {
    const nextParams = new URLSearchParams(searchParams)

    if (category === 'all') {
      nextParams.delete('category')
    } else {
      nextParams.set('category', category)
    }

    if (
      nextParams.toString() === searchParams.toString()
    ) {
      return
    }

    setSearchParams(nextParams, {
      replace: false,
    })
  }

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

      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <p
        className="photo-count"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {filteredPhotos.length}{' '}
        {filteredPhotos.length === 1 ? 'image' : 'images'}
      </p>

      {filteredPhotos.length === 0 ? (
        <div className="gallery-empty">
          <h2>No images found</h2>

          <p>
            There are no images in this category.
          </p>

          <button
            type="button"
            className="category-button"
            onClick={() => handleCategoryChange('all')}
          >
            Show all images
          </button>
        </div>
      ) : (
        <div className="photo-grid">
          {filteredPhotos.map((photo, index) => (
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