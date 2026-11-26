import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import CategoryFilter from './CategoryFilter'
import PhotoCard from './PhotoCard'
import PhotoDialog from './PhotoDialog'
import { photos } from '../data/photos'
import {
  normalizeCategory,
  filterPhotos,
} from '../data/categories'
import '../styles/category-filter.css'
import '../styles/photo-dialog.css'

export default function PhotoGalleryLayout() {
  const [searchParams, setSearchParams] =
    useSearchParams()

  const dialogRef = useRef(null)
  const openerRef = useRef(null)
  const headingRef = useRef(null)

  const activeCategory = normalizeCategory(
    searchParams.get('category'),
  )

  const photoId = searchParams.get('photoId')

  const selectedPhoto =
    photos.find((photo) => photo.id === photoId) ??
    null

  const filteredPhotos = filterPhotos(
    photos,
    activeCategory,
  )

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (selectedPhoto && !dialog.open) {
      dialog.showModal()

      dialog
        .querySelector('.dialog-close-button')
        ?.focus()
    } else if (!selectedPhoto && dialog.open) {
      dialog.close()

      const opener = openerRef.current

      if (opener?.isConnected) {
        opener.focus()
      } else {
        headingRef.current?.focus()
      }

      openerRef.current = null
    }
  }, [selectedPhoto])

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

  function handleOpenPhoto(id, opener) {
    openerRef.current = opener

    const nextParams = new URLSearchParams(searchParams)

    nextParams.set('photoId', id)

    if (
      nextParams.toString() === searchParams.toString()
    ) {
      return
    }

    setSearchParams(nextParams, {
      replace: false,
    })
  }

  function handleClosePhoto() {
    if (!searchParams.has('photoId')) {
      return
    }

    const nextParams = new URLSearchParams(searchParams)

    nextParams.delete('photoId')

    setSearchParams(nextParams, {
      replace: true,
    })
  }

  function handleNativeClose() {
    const dialog = dialogRef.current

    if (dialog?.open) {
      return
    }

    if (selectedPhoto) {
      handleClosePhoto()
    }
  }

  return (
    <section aria-labelledby="gallery-heading">
      <p className="eyebrow">
        PHOTO COLLECTION / 01
      </p>

      <h1
        id="gallery-heading"
        ref={headingRef}
        tabIndex={-1}
      >
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
              onOpen={handleOpenPhoto}
            />
          ))}
        </div>
      )}

      <PhotoDialog
        ref={dialogRef}
        photo={selectedPhoto}
        onRequestClose={handleClosePhoto}
        onNativeClose={handleNativeClose}
      />
    </section>
  )
}