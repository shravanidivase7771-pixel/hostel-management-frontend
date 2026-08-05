import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { Home } from '../pages/Home';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Dashboard Pages
import { AdminDashboard } from '../pages/dashboard/AdminDashboard';
import { StudentDashboard } from '../pages/dashboard/StudentDashboard';
import { WardenDashboard } from '../pages/dashboard/WardenDashboard';
import { WatchmanDashboard } from '../pages/dashboard/WatchmanDashboard';

// Module Pages
import { StudentList } from '../pages/student/StudentList';
import { StudentQR } from '../pages/student/StudentQR';
import { RoomList } from '../pages/room/RoomList';
import { AttendancePage } from '../pages/attendance/AttendancePage';
import { ComplaintList } from '../pages/complaints/ComplaintList';
import { MaintenancePage } from '../pages/maintenance/MaintenancePage';
import { PaymentHistory } from '../pages/payments/PaymentHistory';
import { MessManagement } from '../pages/mess/MessManagement';
import { VisitorHistory } from '../pages/visitors/VisitorHistory';
import { GatePassList } from '../pages/gatepass/GatePassList';
import { NoticeBoard } from '../pages/notices/NoticeBoard';
import { EventManagement } from '../pages/events/EventManagement';
import { GalleryPage } from '../pages/gallery/GalleryPage';
import { ReportGenerator } from '../pages/reports/ReportGenerator';
import { FeedbackPage } from '../pages/feedback/FeedbackPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { SettingsPage } from '../pages/settings/SettingsPage';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Navbar toggleSidebar={setIsSidebarOpen} />
        <main className="p-4 md:p-6 flex-1 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Home & Auth Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ADMIN ONLY ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route
          path="/dashboard/admin"
          element={
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          }
        />
      </Route>

      {/* STUDENT ONLY / STUDENT ACCESSIBLE ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
        <Route
          path="/dashboard/student"
          element={
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          }
        />
      </Route>

      {/* WARDEN ONLY / WARDEN ACCESSIBLE ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['warden', 'admin']} />}>
        <Route
          path="/dashboard/warden"
          element={
            <DashboardLayout>
              <WardenDashboard />
            </DashboardLayout>
          }
        />
      </Route>

      {/* WATCHMAN ONLY / WATCHMAN ACCESSIBLE ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['watchman', 'admin', 'warden']} />}>
        <Route
          path="/dashboard/watchman"
          element={
            <DashboardLayout>
              <WatchmanDashboard />
            </DashboardLayout>
          }
        />
      </Route>

      {/* MULTI-ROLE SHARED MODULE ROUTES (Restricted per role in page logic) */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'student', 'warden', 'watchman']} />}>
        <Route
          path="/inout"
          element={
            <DashboardLayout>
              <WatchmanDashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/students"
          element={
            <DashboardLayout>
              <StudentList />
            </DashboardLayout>
          }
        />
        <Route
          path="/student-qr"
          element={
            <DashboardLayout>
              <StudentQR />
            </DashboardLayout>
          }
        />
        <Route
          path="/rooms"
          element={
            <DashboardLayout>
              <RoomList />
            </DashboardLayout>
          }
        />
        <Route
          path="/attendance"
          element={
            <DashboardLayout>
              <AttendancePage />
            </DashboardLayout>
          }
        />
        <Route
          path="/complaints"
          element={
            <DashboardLayout>
              <ComplaintList />
            </DashboardLayout>
          }
        />
        <Route
          path="/maintenance"
          element={
            <DashboardLayout>
              <MaintenancePage />
            </DashboardLayout>
          }
        />
        <Route
          path="/payments"
          element={
            <DashboardLayout>
              <PaymentHistory />
            </DashboardLayout>
          }
        />
        <Route
          path="/mess"
          element={
            <DashboardLayout>
              <MessManagement />
            </DashboardLayout>
          }
        />
        <Route
          path="/visitors"
          element={
            <DashboardLayout>
              <VisitorHistory />
            </DashboardLayout>
          }
        />
        <Route
          path="/gatepass"
          element={
            <DashboardLayout>
              <GatePassList />
            </DashboardLayout>
          }
        />
        <Route
          path="/notices"
          element={
            <DashboardLayout>
              <NoticeBoard />
            </DashboardLayout>
          }
        />
        <Route
          path="/events"
          element={
            <DashboardLayout>
              <EventManagement />
            </DashboardLayout>
          }
        />
        <Route
          path="/gallery"
          element={
            <DashboardLayout>
              <GalleryPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <DashboardLayout>
              <ReportGenerator />
            </DashboardLayout>
          }
        />
        <Route
          path="/feedback"
          element={
            <DashboardLayout>
              <FeedbackPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          }
        />
      </Route>

      {/* Default Catch-All Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
