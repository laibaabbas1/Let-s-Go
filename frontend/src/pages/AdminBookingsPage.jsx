import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircleFill, XCircleFill, CreditCard } from 'react-bootstrap-icons'; 

function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/bookings/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Bookings ko naye se purane order mein sort karein
            const sortedBookings = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setBookings(sortedBookings);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (bookingId, newStatus) => {
        if (window.confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:5000/api/bookings/update-status/${bookingId}`,
                    { status: newStatus },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                fetchBookings();
            } catch (error) {
                alert('Failed to update status.');
            }
        }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('en-GB');

    if (loading) return <p>Loading all bookings...</p>;

    return (
        <div>
            <h2 className="mb-4">All Customer Bookings ({bookings.length})</h2>
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>User</th>
                            <th>Flight Details</th>
                            <th>Passengers</th>
                            <th>Total Price</th>
                            <th>Booking Date</th>
                            <th>Booking Status</th>
                            <th className='text-center'>Payment Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking._id}>
                                <td>
                                    <div>{booking.user?.name || 'N/A'}</div>
                                    <small className="text-muted">{booking.user?.email || ''}</small>
                                </td>
                                <td>
                                    {booking.flight ? (
                                        <>
                                            <div><strong>{booking.flight.flightNumber}</strong></div>
                                            <small className="text-muted">{booking.flight.origin} → {booking.flight.destination}</small>
                                        </>
                                    ) : 'N/A'}
                                </td>
                                <td>{booking.passengers} ({booking.travelClass})</td>

                                {/* Total price ka data */}
                                <td className="fw-bold">
                                    PKR {booking.priceAtBooking?.toLocaleString() || 'N/A'}
                                </td>

                                <td>{formatDate(booking.createdAt)}</td>

                                <td>
                                    <span className={`badge ${booking.status === 'Confirmed' ? 'bg-success' :
                                            booking.status === 'Pending' ? 'bg-warning text-dark' : 'bg-danger'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>

                                {/* Payment status */}
                                <td className="text-center">
                                    <span
                                        className={`badge ${booking.paymentInfo?.status === 'succeeded' ? 'bg-success' : 'bg-secondary'}`}
                                        title={`Stripe Status: ${booking.paymentInfo?.status}`}
                                    >
                                        <CreditCard className="me-1" />
                                        {booking.paymentInfo?.status || 'N/A'}
                                    </span>
                                </td>

                                <td className="text-center">
                                    {/*Pending' booking ko bhi cancel kiya ja sake  */}
                                    {booking.status === 'Confirmed' || booking.status === 'Pending' ? (
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            title="Mark as Canceled"
                                            onClick={() => handleStatusUpdate(booking._id, 'Canceled')}
                                        >
                                            <XCircleFill /> Cancel
                                        </button>
                                    ) : (
                                        // Canceled bookings ko dobara confirm karne ka option
                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            title="Mark as Confirmed"
                                            onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}
                                        >
                                            <CheckCircleFill /> Confirm
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminBookingsPage;