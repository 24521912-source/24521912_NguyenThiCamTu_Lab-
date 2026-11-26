import { forwardRef } from 'react'

const PhotoDialog = forwardRef(function PhotoDialog(
  {
    photo,
    onRequestClose,
    onNativeClose,
  },
  ref,
) {
  return (
    <dialog
      ref={ref}
      className="photo-dialog"
      aria-labelledby="photo-dialog-title"
      onClose={onNativeClose}
      onCancel={(event) => {
        event.preventDefault()
        onRequestClose()
      }}
    >
      {photo && (
        <div className="photo-dialog-content">
          <header className="photo-dialog-header">
            <h2 id="photo-dialog-title">
              {photo.title}
            </h2>

            <button
              type="button"
              className="dialog-close-button"
              aria-label="Close photo"
              onClick={onRequestClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>

          <img
            className="dialog-image"
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
          />

          <p className="dialog-category">
            Category: {photo.category}
          </p>
        </div>
      )}
    </dialog>
  )
})

export default PhotoDialog