import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';

// Layouts
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AdminLayout from './components/AdminLayout.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx'; 

// Admin Pages
import AddFlightPage from './pages/AddFlightPage.jsx';
import AdminFlightsPage from './pages/AdminFlightsPage.jsx';
import AdminBookingsPage from './pages/AdminBookingsPage.jsx';
import AdminInvitesPage from './pages/AdminInvitesPage.jsx';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/flights" element={<SearchResultsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/booking-success" element={
              <div className="container text-center my-5 vh-100">
                <div className="p-5" style={{ border: '2px dashed var(--primary-color)', borderRadius: '15px', backgroundColor: '#f0f8f7' }}>
                  <h1 style={{ color: 'var(--primary-color)' }}>✓ Booking Confirmed!</h1>
                  <p className="lead">Your payment was successful and your flight is booked.</p>
                  <p>You can view your booking details in the "My Bookings" section.</p>
                  <Link to="/my-bookings" className="btn btn-primary" style={{ backgroundColor: 'var(--secondary-color)', border: 'none' }}>
                    View My Bookings
                  </Link>
                </div>
              </div>
            } />

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="flights" replace />} />
              <Route path="flights" element={<AdminFlightsPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="add-flight" element={<AddFlightPage />} />
              <Route path="invites" element={<AdminInvitesPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* User Profile Route */}
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;