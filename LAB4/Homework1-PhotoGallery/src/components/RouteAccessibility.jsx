import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

const pageTitles = {
  '/': 'Home',
  '/gallery': 'Gallery',
  '/about': 'About',
}

export default function RouteAccessibility() {
  const { pathname } = useLocation()
  const previousPathRef = useRef(pathname)

  useEffect(() => {
    const normalizedPath =
      pathname.replace(/\/+$/, '').toLowerCase() || '/'

    const pageTitle =
      pageTitles[normalizedPath] ?? 'Page not found'

    document.title = `${pageTitle} | FrameGallery`

    if (previousPathRef.current !== pathname) {
      document
        .getElementById('main-content')
        ?.focus()

      previousPathRef.current = pathname
    }
  }, [pathname])

  return null
}