import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { EnvelopeFill, GeoAltFill, TelephoneFill } from 'react-bootstrap-icons';
import axios from 'axios';

import heroImageUrl from '../assets/contactuspic.jpg';

function ContactPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState({ sent: false, msg: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ sent: false, msg: 'Sending...' });
        try {
            const response = await axios.post('http://localhost:5000/api/messages/send', formData);
            if (response.data.success) {
                setStatus({ sent: true, msg: 'Message sent successfully! Thank you.' });
                setFormData({ fullName: '', email: '', message: '' });
            }
        } catch (error) {
            setStatus({ sent: false, msg: 'Failed to send message. Please try again.' });
        }
    };

    //  HERO SECTION KE LIYE STYLE 
    const heroStyles = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${heroImageUrl})`,
        height: '50vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div>
            <div
                style={heroStyles}
                className="d-flex align-items-center justify-content-center text-white text-center"
            >
                <div>
                    <h1 className="display-3 fw-bold " style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>Contact Us</h1>
                    <p className="lead">We'd love to hear from you. We are here to help!</p>
                </div>
            </div>

            <div className="container my-5">
                <div className="row g-5">
                    <div className="col-lg-6">
                        <h3 className="mb-4">Get In Touch</h3>
                        <p className="text-muted">
                            Please feel free to contact us with any questions or inquiries. Our support team is here to help you.
                        </p>
                        <div className="mt-4">
                            <div className="d-flex align-items-start mb-3">
                                <GeoAltFill size={24} className="me-3" style={{ color: 'var(--primary-color)' }} />
                                <div>
                                    <h5 className="mb-1">Company Address</h5>
                                    <span className="text-muted">123 Airline Avenue, Airport Road, Karachi, Pakistan</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-start mb-3">
                                <TelephoneFill size={24} className="me-3" style={{ color: 'var(--primary-color)' }} />
                                <div>
                                    <h5 className="mb-1">Mobile</h5>
                                    <span className="text-muted">+92 300 1234567</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-start">
                                <EnvelopeFill size={24} className="me-3" style={{ color: 'var(--primary-color)' }} />
                                <div>
                                    <h5 className="mb-1">Email</h5>
                                    <span className="text-muted">letsgo.flightbook@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <Card className="shadow-lg border-0 p-4">
                            <Card.Body>
                                <h3 className="text-center mb-4">Send Us A Message</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="fullName" className="form-label">Full Name</label>
                                        <input type="text" className="form-control" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="message" className="form-label">Your Message</label>
                                        <textarea className="form-control" id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Submit</button>
                                </form>
                                {status.msg && (
                                    <div className={`alert mt-3 ${status.msg === 'Sending...' ? 'alert-info' : (status.sent ? 'alert-success' : 'alert-danger')}`}>
                                        {status.msg}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;