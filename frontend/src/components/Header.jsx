import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import logoImage from '../assets/logo.png';

function Header() {
    const { user, logout } = useContext(AuthContext);

    return (
        <header>
            <Navbar bg="light" expand="lg" className="shadow-sm">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            src={logoImage}
                            alt="Let's Go Logo"
                            style={{ height: '55px' }}
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center">

                            <NavLink to="/" className="nav-link">Home</NavLink>

                            {user && <NavLink to="/my-bookings" className="nav-link">My Bookings</NavLink>}

                            <NavLink to="/contact" className="nav-link">Contact Us</NavLink>
                            <NavLink to="/about" className="nav-link">About Us</NavLink>

                            {user && user.role === 'admin' && (
                                <NavLink to="/admin" className="nav-link">Admin Panel</NavLink>
                            )}

                            {user ? (
                                <NavDropdown align="end" title={<img src={user.profilePicture} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />} id="basic-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={() => { logout(); window.location.href = '/auth'; }}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Link to="/auth" className="btn btn-outline-primary ms-2 px-3">Login</Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;