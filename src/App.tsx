import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { HomePage } from '@/pages/HomePage'
import { ListingsPage } from '@/pages/ListingsPage'
import { PropertyDetailPage } from '@/pages/PropertyDetailPage'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { LoginPage } from '@/pages/admin/LoginPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { PropertyEditorPage } from '@/pages/admin/PropertyEditorPage'
import { AdminConfigPage } from '@/pages/admin/AdminConfigPage'
import { RequireAuth } from '@/pages/admin/RequireAuth'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="imoveis" element={<ListingsPage />} />
        <Route path="imoveis/:slug" element={<PropertyDetailPage />} />
        <Route path="sobre" element={<AboutPage />} />
        <Route path="contato" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="admin/login" element={<LoginPage />} />
      <Route
        path="admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="imoveis/novo" element={<PropertyEditorPage />} />
        <Route path="imoveis/:id" element={<PropertyEditorPage />} />
        <Route path="config" element={<AdminConfigPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}
