import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function SearchResultsPage() {
    //hooks
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    //statevariables
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingInProgress, setBookingInProgress] = useState(null);

    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const passengers = searchParams.get('passengers');
    const travelClass = searchParams.get('travelClass');

    // Data Fetching Effect
    useEffect(() => {
        const fetchFlights = async () => {
            if (!origin || !destination || !date || !passengers || !travelClass) {
                setError("Missing search details. Please try searching again.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:5000/flights/search?origin=${origin}&destination=${destination}&date=${date}&passengers=${passengers}&travelClass=${travelClass}`
                );
                setFlights(response.data);
                setError('');
            } catch (err) {
                setError('Could not fetch flights. Please try again later.');
                console.error("Axios Error:", err.response ? err.response.data : err);
            } finally {
                setLoading(false);
            }
        };
        fetchFlights();
    }, [origin, destination, date, passengers, travelClass]);

    //  handleBookNow function payment flow ke liye
    const handleBookNow = async (flight, selectedClass) => {
        setBookingInProgress(selectedClass.className);
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to book a flight.');
            navigate('/auth');
            return;
        }

        const numPassengers = parseInt(passengers, 10);

        try {
            //  Backend par 'Pending' status ke saath booking create ho ge
            const { data } = await axios.post('http://localhost:5000/api/bookings/create',
                {
                    flightId: flight._id,
                    passengers: numPassengers,
                    travelClass: selectedClass.className,
                    // Price backend par calculate hoga aur wapas aayega
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Backend se mile data ke saath Checkout page par redirect ho g
            if (data.success && data.booking) {
                navigate('/checkout', {
                    state: {
                        bookingId: data.booking._id,
                        amount: data.booking.priceAtBooking,
                        flightDetails: {
                            origin: flight.origin,
                            destination: flight.destination,
                            airline: flight.airline
                        }
                    }
                });
            } else {
                throw new Error("Booking could not be initiated.");
            }

        } catch (error) {
            alert(error.response?.data?.message || 'Failed to initiate booking.');
        } finally {
            setBookingInProgress(null); // Loading state hata de
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Flights from <strong>{origin}</strong> to <strong>{destination}</strong></h2>

            {loading && <div className="text-center mt-5"><div className="spinner-border"></div><p>Searching for flights...</p></div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && flights.length === 0 && !error && (
                <div className="alert alert-warning mt-4">Sorry, no flights were found for this route. <Link to="/">Try another search</Link>.</div>
            )}

            {flights.map((flight) => (
                <div key={flight._id} className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-lg-4 d-flex align-items-center mb-3 mb-lg-0">
                                {/* Flight details... */}
                                <img src={flight.airlineLogo || 'https://via.placeholder.com/100x40.png?text=Logo'} alt={flight.airline} style={{ height: '40px', marginRight: '15px' }} />
                                <div>
                                    <span className="fw-bold fs-5">{flight.airline}</span>
                                    <div className="text-muted small">{flight.flightNumber}</div>
                                    <div className="text-muted small">{flight.origin} → {flight.destination}</div>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                {flight.travelClasses.map((tc) => (
                                    <div key={tc.className} className="row align-items-center border-bottom py-2">
                                        <div className="col-4"><strong>{tc.className}</strong></div>
                                        <div className="col-4 text-center">
                                            <h5 style={{ color: 'var(--primary-color)' }}>PKR {tc.price.toLocaleString()}</h5>
                                            <span className="badge bg-light text-dark">{tc.seatsAvailable} seats left</span>
                                        </div>
                                        <div className="col-4 text-end">

                                            {/* button */}
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleBookNow(flight, tc)} // Poora flight aur class object bhej rahe hain
                                                disabled={tc.seatsAvailable < passengers || bookingInProgress}
                                            >
                                                {bookingInProgress === tc.className ? (
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                ) : (
                                                    'Book Now'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SearchResultsPage;