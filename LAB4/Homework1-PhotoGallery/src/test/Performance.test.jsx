import { describe, expect, it } from 'vitest'
import {
  render,
  screen,
  within,
} from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import App from '../App'
import { photos } from '../data/photos'

function renderGallery(path = '/gallery') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

function getGalleryImages() {
  return within(
    screen.getByRole('main'),
  ).getAllByRole('img')
}

describe('Gallery performance contracts', () => {
  it('uses local image resources', () => {
    renderGallery()

    getGalleryImages().forEach((image) => {
      expect(
        image.getAttribute('src'),
      ).toMatch(/^\/images\//)
    })
  })

  it('provides explicit image dimensions', () => {
    renderGallery()

    getGalleryImages().forEach((image) => {
      expect(
        Number(image.getAttribute('width')),
      ).toBeGreaterThan(0)

      expect(
        Number(image.getAttribute('height')),
      ).toBeGreaterThan(0)
    })
  })

  it('loads the first gallery image eagerly', () => {
    renderGallery()

    const images = getGalleryImages()

    expect(images[0]).toHaveAttribute(
      'loading',
      'eager',
    )
  })

  it('lazy loads non-priority images', () => {
    renderGallery()

    const images = getGalleryImages()

    images.slice(1).forEach((image) => {
      expect(image).toHaveAttribute(
        'loading',
        'lazy',
      )
    })
  })

  it('assigns high fetch priority to the first image', () => {
    renderGallery()

    const images = getGalleryImages()

    expect(images[0]).toHaveAttribute(
      'fetchpriority',
      'high',
    )
  })

  it('does not assign high priority to other images', () => {
    renderGallery()

    const images = getGalleryImages()

    images.slice(1).forEach((image) => {
      expect(image).not.toHaveAttribute(
        'fetchpriority',
        'high',
      )
    })
  })

  it('uses asynchronous decoding for non-priority images', () => {
    renderGallery()

    const images = getGalleryImages()

    images.slice(1).forEach((image) => {
      expect(image).toHaveAttribute(
        'decoding',
        'async',
      )
    })
  })

  it('updates image priority after category filtering', () => {
    renderGallery('/gallery?category=urban')

    const images = getGalleryImages()

    expect(images).toHaveLength(2)

    expect(images[0]).toHaveAttribute(
      'fetchpriority',
      'high',
    )

    expect(images[0]).toHaveAttribute(
      'loading',
      'eager',
    )

    expect(images[1]).toHaveAttribute(
      'loading',
      'lazy',
    )
  })

  it('uses unique photo identifiers', () => {
    const identifiers = photos.map(
      (photo) => photo.id,
    )

    expect(
      new Set(identifiers).size,
    ).toBe(identifiers.length)
  })

  it('provides complete image metadata', () => {
    photos.forEach((photo) => {
      expect(photo.id).toBeTruthy()
      expect(photo.title).toBeTruthy()
      expect(photo.category).toBeTruthy()
      expect(photo.src).toBeTruthy()
      expect(photo.alt).toBeTruthy()
      expect(photo.width).toBeGreaterThan(0)
      expect(photo.height).toBeGreaterThan(0)
    })
  })
})