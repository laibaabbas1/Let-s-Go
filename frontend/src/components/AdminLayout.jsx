import React, { useContext } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AdminLayout.css'; 
import {  Airplane, Book, KeyFill } from 'react-bootstrap-icons';

function AdminLayout() {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Jab tak user load ho raha hai
    }

    // Security Check: Agar user login nahi hai ya admin nahi hai, to usse bahar bhej do
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="admin-dashboard container-fluid">
            <div className="row">
                <aside className="col-md-2 admin-sidebar">
                    <nav className="nav flex-column">
                        <NavLink className="nav-link" to="/admin/flights">
                            <Airplane className="me-2" /> All Flights
                        </NavLink>
                        <NavLink className="nav-link" to="/admin/bookings">
                            <Book className="me-2" /> All Bookings
                        </NavLink>
                        <NavLink className="nav-link" to="/admin/add-flight">
                            <Airplane className="me-2" /> Add New Flight
                        </NavLink>
                        <NavLink className="nav-link" to="/admin/invites">
                            <KeyFill className="me-2" /> Admin Invites
                        </NavLink>
                        <NavLink className="nav-link" to="/admin/profile">My Profile</NavLink>

                    </nav>
                </aside>
                <main className="col-md-10 admin-content">
                    <Outlet /> {/* Yahan par child pages (All Flights, All Bookings) render honge */}
                </main>
            </div>
        </div>
    );
}
export default AdminLayout;