import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { ShieldCheck, TagsFill, Headset, Bullseye, Linkedin, Github, Globe } from 'react-bootstrap-icons';
import heroImageUrl from '../assets/aboutuspic.jpg';

import teamMember1 from '../assets/laibaa.jpg';
import teamMember2 from '../assets/areeba.jpg';
import teamMember3 from '../assets/sabaa.jpg';

import './AboutPage.css';

function AboutPage() {
    const teamMembers = [
        {
            name: 'Laiba Abbas',
            role: 'Backend Developer ',
            image: teamMember1,
            socials: { linkedin: 'https://www.linkedin.com/in/laiba-abbas-2620b6334/', github: 'https://github.com/laibaabbas1', portfolio: '#' }
        },
        {
            name: 'Areeba Akbar',
            role: 'Frontend Developer',
            image: teamMember2,
            socials: { linkedin: 'http://www.linkedin.com/in/areeba-akbar-984773378/', github: 'https://github.com/LearnWebToday', portfolio: '#' }
        },
        {
            name: 'Saba Akram',
            role: 'UI/UX Designer',
            image: teamMember3,
            socials: { linkedin: '#', github: 'https://github.com/sabaakram0103', portfolio: '#' }
        }
    ];

    const heroStyles = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImageUrl})`,
        height: '50vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div>
            {/* Hero Section*/}
            <div style={heroStyles} className="d-flex align-items-center justify-content-center text-white text-center">
                <div>
                    <h1 className="display-4 fw-bold">About Let's Go</h1>
                    <p className="lead">Your trusted partner in discovering Pakistan.</p>
                </div>
            </div>

            {/*Our Story */}
            <div className="container my-5">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6">
                        <h2>Our Story</h2>
                        <p className="text-muted">Founded in 2025, Let's Go was born from a simple idea: to make air travel within Pakistan accessible, affordable, and hassle-free for everyone. We saw the need for a simple, user-friendly platform dedicated to domestic flights, and we decided to build it.</p>
                    </div>

                    {/* WHY CHOOSE US */}
                    <div className="col-lg-6">
                        <h2>Why Choose Us?</h2>
                        <ul className="list-unstyled">
                            <li className="d-flex align-items-start mb-3">
                                <ShieldCheck size={24} className="me-3 text-success flex-shrink-0 mt-1" />
                                <div>
                                    <strong>Secure & Reliable</strong>
                                    <p className="text-muted mb-0">Your bookings are safe with our industry-leading security measures and reliable service.</p>
                                </div>
                            </li>
                            <li className="d-flex align-items-start mb-3">
                                <TagsFill size={24} className="me-3" style={{ color: 'var(--primary-color)' }} />
                                <div>
                                    <strong>Best Prices Guaranteed</strong>
                                    <p className="text-muted mb-0">We find you the most affordable domestic flights across Pakistan without any hidden fees.</p>
                                </div>
                            </li>
                            <li className="d-flex align-items-start">
                                <Headset size={24} className="me-3 text-info flex-shrink-0 mt-1" />
                                <div>
                                    <strong>24/7 Customer Support</strong>
                                    <p className="text-muted mb-0">Our dedicated support team is always available to help you with your travel plans.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Our Mission Section */}
            <div className="mission-section-wrapper py-5">
                <div className="container text-center">
                    <Bullseye size={50} className="mb-3" style={{ color: 'var(--primary-color)' }} />
                    <h2>Our Mission</h2>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '800px' }}>
                        To connect people and places across Pakistan with unparalleled ease and reliability. We are committed to providing a seamless booking experience, ensuring every journey is safe, comfortable, and memorable.
                    </p>
                </div>
            </div>

            {/*Meet Our Team Section  */}
            <div className="container my-5">
                <h2 className="text-center mb-5">Meet Our Team</h2>
                <Row>
                    {teamMembers.map((member, index) => (
                        <Col md={4} key={index} className="mb-4">
                            <Card className="team-card h-100 text-center">
                                <Card.Img variant="top" src={member.image} className="team-card-img" />
                                <Card.Body>
                                    <Card.Title as="h4">{member.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{member.role}</Card.Subtitle>
                                    <div className="team-social-icons mt-3">
                                        <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin /></a>
                                        <a href={member.socials.github} target="_blank" rel="noopener noreferrer"><Github /></a>
                                        <a href={member.socials.portfolio} target="_blank" rel="noopener noreferrer"><Globe /></a>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}

export default AboutPage;