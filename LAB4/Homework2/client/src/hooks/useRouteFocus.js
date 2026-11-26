import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export function useRouteFocus() {
  const { pathname } = useLocation()

  const mainRef = useRef(null)
  const previousPath = useRef(pathname)

  useEffect(() => {
    if (previousPath.current === pathname) {
      return
    }

    previousPath.current = pathname

    mainRef.current?.focus()
  }, [pathname])

  return mainRef
}