import { Route, Routes } from 'react-router'
import AppLayout from './components/AppLayout'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}