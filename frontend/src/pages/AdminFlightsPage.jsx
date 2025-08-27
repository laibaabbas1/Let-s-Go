import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminFlightsPage() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/flights/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFlights(res.data);
            } catch (error) {
                console.error("Failed to fetch flights", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFlights();
    }, []);

    if (loading) return <p>Loading flights...</p>;

    return (
        <div>
            <h2 className="mb-4">All Available Flights ({flights.length})</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th rowSpan="2" className="align-middle">Flight No.</th>
                            <th rowSpan="2" className="align-middle">Airline</th>
                            <th rowSpan="2" className="align-middle">Route</th>
                            <th colSpan="2" className="text-center">Economy</th>
                            <th colSpan="2" className="text-center">Business</th>
                            <th colSpan="2" className="text-center">First</th>
                        </tr>
                        <tr>
                            <th className="text-center">Price</th>
                            <th className="text-center">Seats</th>
                            <th className="text-center">Price</th>
                            <th className="text-center">Seats</th>
                            <th className="text-center">Price</th>
                            <th className="text-center">Seats</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map(flight => {
                            const getClassDetails = (className) => {
                                if (!flight.travelClasses || !Array.isArray(flight.travelClasses)) {
                                    return { price: 'N/A', seatsAvailable: 'N/A' };
                                }
                                const travelClass = flight.travelClasses.find(c => c.className === className);
                                return travelClass || { price: 'N/A', seatsAvailable: 'N/A' };
                            };

                            const economy = getClassDetails('Economy');
                            const business = getClassDetails('Business');
                            const first = getClassDetails('First');

                            return (
                                <tr key={flight._id}>
                                    <td>{flight.flightNumber}</td>
                                    <td>{flight.airline}</td>
                                    <td>{flight.origin} → {flight.destination}</td>
                                    
                                    <td className="text-center">{economy.price?.toLocaleString() || 'N/A'}</td>
                                    <td className="text-center">{economy.seatsAvailable}</td>
                                    
                                    <td className="text-center">{business.price?.toLocaleString() || 'N/A'}</td>
                                    <td className="text-center">{business.seatsAvailable}</td>

                                    <td className="text-center">{first.price?.toLocaleString() || 'N/A'}</td>
                                    <td className="text-center">{first.seatsAvailable}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminFlightsPage;