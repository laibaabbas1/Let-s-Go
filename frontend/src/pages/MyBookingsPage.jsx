import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import heroImageUrl from '../assets/mybookingpic.jpeg';

function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [editData, setEditData] = useState({ newPassengers: 1, newTravelClass: 'Economy' });

    const fetchUserBookings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/bookings/mybookings', { headers: { Authorization: `Bearer ${token}` } });
            // Bookings ko naye se purane order mein sort karein
            const sortedBookings = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setBookings(sortedBookings);
        } catch (error) { console.error("Failed to fetch user bookings", error); }
        finally { setLoading(false); }
    };

    const openEditModal = (booking) => {
        setEditingBooking(booking);
        setEditData({ newPassengers: booking.passengers, newTravelClass: booking.travelClass });
        setShowModal(true);
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const newEditData = {
                newPassengers: parseInt(editData.newPassengers),
                newTravelClass: editData.newTravelClass
            };

            // pehle price ka farq calculate karein
            const { data } = await axios.post(
                `http://localhost:5000/api/bookings/recalculate-edit/${editingBooking._id}`,
                newEditData,
                config
            );

            const { priceDifference } = data;

            // Price difference ke hisaab se action 
            if (priceDifference > 0) {
                //  EXTRA PAISE DENE HAIN
                if (window.confirm(`You need to pay an additional PKR ${priceDifference.toLocaleString()}. Proceed to payment?`)) {
                    navigate('/checkout', {
                        state: {
                            amount: priceDifference,
                            bookingId: editingBooking._id,
                            isEdit: true,
                            editData: newEditData, 
                            flightDetails: { 
                                origin: editingBooking.flight.origin,
                                destination: editingBooking.flight.destination,
                                airline: editingBooking.flight.airline
                            }
                        }
                    });
                }
            } else {
                let confirmationMessage = 'Are you sure you want to update this booking?';
                if (priceDifference < 0) {
                    confirmationMessage = `Your booking will be updated and a refund of PKR ${Math.abs(priceDifference).toLocaleString()} will be processed. Continue?`;
                }

                if (window.confirm(confirmationMessage)) {
                    // Purane /edit wale API ko call karein
                    await axios.put(
                        `http://localhost:5000/api/bookings/edit/${editingBooking._id}`,
                        newEditData,
                        config
                    );

                    if (priceDifference < 0) {
                        alert('Booking updated successfully! Your refund has been initiated.');
                    } else {
                        alert('Booking updated successfully!');
                    }

                    fetchUserBookings(); // Booking list refresh 
                }
            }

        } catch (error) {
            alert(error.response?.data?.message || 'Failed to process the edit request.');
        } finally {
            setShowModal(false); // Modal ko band kar dein
        }
    };

    useEffect(() => {
        if (!user) { navigate('/auth'); return; }
        fetchUserBookings();
    }, [user, navigate]);

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this flight booking?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:5000/api/bookings/cancel/${bookingId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
                fetchUserBookings();
                alert('Your booking has been successfully canceled.');
            } catch (error) { alert('Failed to cancel the booking. Please try again.'); }
        }
    };

    const formatTime = (date) => new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const formatDate = (date) => new Date(date).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const bannerStyles = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${heroImageUrl})`,
        height: '50vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '15px'
    };

    if (loading) { return <div className="container text-center py-5"><h4>Loading your bookings...</h4></div>; }

    return (
        <div>
            <div className="container mt-5">
                <div
                    style={bannerStyles}
                    className="d-flex align-items-center justify-content-center text-white text-center p-4"
                >
                    <div>
                        <h1 className="display-3 fw-bold " style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>My Bookings</h1>
                        <p className="lead">Review and manage your flight history.</p>
                    </div>
                </div>
            </div>

            <div className="container my-5">
                {bookings.length === 0 ? (
                    <div className="alert alert-info">You have no flight bookings yet. <Link to="/">Find a flight</Link> to get started.</div>
                ) : (
                    bookings.map(booking => (
                        <div key={booking._id} className={`card mb-4 shadow-sm ${booking.status === 'Canceled' ? 'bg-light text-muted' : ''}`}>
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div><strong>Flight Date: {booking.flight ? formatDate(booking.flight.departureTime) : 'N/A'}</strong></div>

                                <div>
                                    <span className={`badge fs-6 me-2 ${booking.status === 'Confirmed' ? 'bg-success' :
                                            booking.status === 'Pending' ? 'bg-warning text-dark' : 'bg-danger'
                                        }`}>
                                        {booking.status}
                                    </span>
                                    <span className={`badge fs-6 ${booking.paymentInfo?.status === 'succeeded' ? 'bg-info text-dark' : 'bg-secondary'
                                        }`}>
                                        Payment: {booking.paymentInfo?.status || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-md-3">
                                        <span className="fw-bold fs-5">{booking.flight?.airline || 'N/A'}</span>
                                        <div className="text-muted small">{booking.flight?.flightNumber || 'N/A'}</div>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <div>
                                                <div className="fs-5 fw-bold">{booking.flight?.origin || 'N/A'}</div>
                                                <div className="text-muted">{booking.flight ? formatTime(booking.flight.departureTime) : 'N/A'}</div>
                                            </div>
                                            <div className="text-muted mx-3">➔</div>
                                            <div>
                                                <div className="fs-5 fw-bold">{booking.flight?.destination || 'N/A'}</div>
                                                <div className="text-muted">{booking.flight ? formatTime(booking.flight.arrivalTime) : 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2 text-center">
                                        <div><strong>Passengers:</strong> {booking.passengers}</div>
                                        <div className="text-muted small">({booking.travelClass})</div>
                                    </div>
                                    <div className="col-md-3 text-end">
                                        {(booking.status === 'Confirmed' || booking.status === 'Pending') && (
                                            <>
                                                {booking.status === 'Confirmed' && (
                                                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEditModal(booking)}>Edit</button>
                                                )}
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancelBooking(booking._id)}>Cancel</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                    Booked on: {formatDate(booking.createdAt)} at {formatTime(booking.createdAt)}
                                </small>
                                <strong style={{ color: 'var(--primary-color)' }}>
                                    Total Amount: PKR {booking.priceAtBooking.toLocaleString()}
                                </strong>
                            </div>

                            {booking.status === 'Pending' && (
                                <div className="card-footer bg-warning-subtle text-center border-top-0">
                                    <p className="mb-2 fw-bold text-danger-emphasis small">Action Required: Your booking is not confirmed yet. Please complete the payment.</p>
                                    <button
                                        className="btn btn-primary"
                                        style={{ backgroundColor: 'var(--secondary-color)', border: 'none' }}
                                        onClick={() => navigate('/checkout', {
                                            state: {
                                                bookingId: booking._id,
                                                amount: booking.priceAtBooking,
                                                flightDetails: {
                                                    origin: booking.flight?.origin,
                                                    destination: booking.flight?.destination,
                                                    airline: booking.flight?.airline
                                                }
                                            }
                                        })}
                                    >
                                        Proceed to Payment
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Your Booking</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Number of Passengers</Form.Label>
                                <Form.Control type="number" name="newPassengers" value={editData.newPassengers} onChange={handleEditChange} min="1" required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Travel Class</Form.Label>
                                <Form.Select name="newTravelClass" value={editData.newTravelClass} onChange={handleEditChange}>
                                    <option value="Economy">Economy</option>
                                    <option value="Business">Business</option>
                                    <option value="First">First</option>
                                </Form.Select>
                            </Form.Group>
                            <Button variant="primary" type="submit">Save Changes</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

export default MyBookingsPage;