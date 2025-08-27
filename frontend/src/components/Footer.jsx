import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Envelope, Telephone } from 'react-bootstrap-icons';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer-dark mt-auto">
            <Container>
                <Row>
                    {/* About Let's Go */}
                    <Col md={6} lg={4} className="mb-4 mb-md-0">
                        <Link to="/" className="footer-brand-link">
                            <h5>Let's Go</h5>
                        </Link>
                        <p style={{ color: '#fff' }}>
                            Your trusted partner in discovering Pakistan. We make air travel accessible, affordable, and hassle-free for everyone.
                        </p>
                    </Col>

                    {/*Quick Links */}
                    <Col md={6} lg={2} className="mb-4 mb-md-0">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/my-bookings">My Bookings</Link></li>
                        </ul>
                    </Col>

                    {/* Contact Info  */}
                    <Col md={6} lg={3} className="mb-4 mb-md-0">
                        <h5>Contact</h5>
                        <ul className="list-unstyled">
                            <li>
                                <a href="mailto:letsgo.flightbook@gmail.com">
                                    <Envelope className="me-2" />
                                    letsgo.flightbook@gmail.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+92331412345">
                                    <Telephone className="me-2" />
                                    +92 300 1234567
                                </a>
                            </li>
                        </ul>
                    </Col>

                    {/*  Social Media */}
                    <Col md={6} lg={3}>
                        <h5>Follow Us</h5>
                        <div className="social-icons">
                            <a href="#" target="_blank" rel="noopener noreferrer"><Facebook /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer"><Instagram /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer"><Twitter /></a>
                        </div>
                    </Col>
                </Row>

                {/* Copyright Section */}
                <div className="footer-copyright mt-4">
                    © {new Date().getFullYear()}  Let's Go | Developed with ❤ By Let's Go Team
                </div>
            </Container>
        </footer>
    );
}

export default Footer;