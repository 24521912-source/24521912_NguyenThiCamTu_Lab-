export const categories = [
  {
    id: 'all',
    label: 'All',
  },
  {
    id: 'nature',
    label: 'Nature',
  },
  {
    id: 'urban',
    label: 'Urban',
  },
  {
    id: 'architecture',
    label: 'Architecture',
  },
]

export function normalizeCategory(value) {
  const isValid = categories.some(
    (category) => category.id === value,
  )

  return isValid ? value : 'all'
}

export function filterPhotos(photos, category) {
  if (category === 'all') {
    return photos
  }

  return photos.filter(
    (photo) => photo.category === category,
  )
}