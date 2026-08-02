import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '@/src/pages/HomePage'
import CentralLoginPage from '@/src/pages/login/CentralLoginPage'
import StudentLoginPage from '@/src/pages/login/StudentLoginPage'
import OrganizerLoginPage from '@/src/pages/login/OrganizerLoginPage'
import AdminLoginPage from '@/src/pages/login/AdminLoginPage'
import EventsPage from '@/src/pages/events/EventsPage'
import EventDetailPage from '@/src/pages/events/EventDetailPage'
import MyPassesPage from '@/src/pages/my-passes/MyPassesPage'
import DashboardPage from '@/src/pages/dashboard/DashboardPage'
import CertificatesPage from '@/src/pages/certificates/CertificatesPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<CentralLoginPage />} />
      <Route path="/login/student" element={<StudentLoginPage />} />
      <Route path="/login/organizer" element={<OrganizerLoginPage />} />
      <Route path="/login/admin" element={<AdminLoginPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/my-passes" element={<MyPassesPage />} />
      <Route path="/certificates" element={<CertificatesPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}
