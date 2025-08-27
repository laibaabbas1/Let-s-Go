import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card, Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';

// Stripe ko yahan component ke bahar load kia h
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const CheckoutForm = ({ bookingDetails, isEdit, editData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required'
        });

        if (confirmError) {
            setError(confirmError.message);
            setLoading(false);
            return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Backend ko bhejna data jo 
                const payload = {
                    bookingId: bookingDetails.bookingId,
                    paymentIntentId: paymentIntent.id
                };

                if (isEdit) {
                    payload.editData = editData;
                }

                // Ab payload ke saath request bhejein
                await axios.put('/api/v1/booking/status/update', payload, config);

                if (isEdit) {
                    alert('Booking updated successfully!');
                    navigate('/my-bookings');
                } else {
                    navigate('/booking-success');
                }

            } catch (error) {
                setError("Payment successful, but failed to update booking. Please contact support.");
            }
        } else {
            setError("Payment failed or is still processing.");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            <Button
                type="submit"
                disabled={!stripe || loading}
                className="w-100 mt-4"
                style={{ backgroundColor: 'var(--secondary-color)', border: 'none', padding: '12px' }}
            >
                {loading ? <Spinner as="span" animation="border" size="sm" /> : `Pay PKR ${bookingDetails.amount?.toLocaleString()}`}
            </Button>
        </form>
    );
};

// Main Checkout Page Component
function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingId, amount, flightDetails, isEdit, editData } = location.state || {};
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (!bookingId || !amount) {
            navigate('/');
            return;
        }
        const getClientSecret = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };
                const { data } = await axios.post('/api/v1/payment/process', { amount, bookingId }, config);
                setClientSecret(data.client_secret);
            } catch (err) {
                console.error("Failed to get client secret:", err.response ? err.response.data : err);
            }
        };
        getClientSecret();
    }, [bookingId, amount, navigate]);

    const options = {
        clientSecret,
        appearance: { theme: 'stripe' },
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
                        <Card.Header className="text-white text-center" style={{ backgroundColor: 'var(--primary-color)', borderRadius: '15px 15px 0 0' }}>
                            <h3 className="mb-0">Secure Payment</h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {flightDetails && (
                                <div className="mb-4">
                                    <h5>Booking Summary</h5>
                                    <p className="mb-1">
                                        <strong>{isEdit ? 'Updating Booking For:' : 'Flight:'}</strong>
                                        {` ${flightDetails.origin} to ${flightDetails.destination}`}
                                    </p>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <h5>{isEdit ? 'Additional Amount:' : 'Total Amount:'}</h5>
                                        <h5 style={{ color: 'var(--primary-color)' }}>PKR {amount?.toLocaleString()}</h5>
                                    </div>
                                </div>
                            )}

                            {clientSecret ? (
                                <Elements options={options} stripe={stripePromise}>
                                    <CheckoutForm
                                        bookingDetails={{ bookingId, amount }}
                                        isEdit={isEdit}
                                        editData={editData}
                                    />
                                </Elements>
                            ) : (
                                <div className="text-center p-5">
                                    <Spinner animation="border" style={{ color: 'var(--primary-color)' }} />
                                    <p className="mt-3">Initializing secure payment...</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default CheckoutPage;