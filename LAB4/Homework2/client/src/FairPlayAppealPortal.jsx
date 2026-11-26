import { Route, Routes } from 'react-router-dom'
import PortalLayout from './components/PortalLayout'
import Overview from './pages/Overview'
import DossierView from './pages/DossierView'
import NotFound from './pages/NotFound'
import AppealFormProvider from './context/AppealFormProvider'

export default function FairPlayAppealPortal() {
  return (
    <AppealFormProvider>
      <Routes>
        <Route path="/" element={<PortalLayout />}>
          <Route index element={<Overview />} />

          <Route
            path="dossier/:playerID"
            element={<DossierView />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>
      </Routes>
    </AppealFormProvider>
  )
}