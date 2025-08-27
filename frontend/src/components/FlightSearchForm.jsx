import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Props se 'onLocationChange' function receive kia h Map ke liye
function FlightSearchForm({ onLocationChange }) {
    const [tripType, setTripType] = useState('one-way');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [travelClass, setTravelClass] = useState('Economy');
    
    const navigate = useNavigate();
    // Pakistan ke shehron ke IATA codes (map ke liye zaroori hota h)
    const pakistaniCities = {
        "Karachi": "KHI", "Lahore": "LHE", "Islamabad": "ISB",
        "Peshawar": "PEW", "Quetta": "UET", "Multan": "MUX",
        "Faisalabad": "LYP", "Sialkot": "SKT", "Gwadar": "GWD"
    };
    const handleOriginChange = (e) => {
        const cityName = e.target.value;
        setOrigin(cityName);
        // Map ke liye HomePage ko update bhejna 
        if (onLocationChange) {
            onLocationChange('origin', pakistaniCities[cityName]);
        }
    };

    // Destination change hone par state aur map dono update honi
    const handleDestinationChange = (e) => {
        const cityName = e.target.value;
        setDestination(cityName);
        if (onLocationChange) {
            onLocationChange('destination', pakistaniCities[cityName]);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!origin || !destination || !departureDate) {
            alert("Please fill all required fields.");
            return;
        }

        // Search URL mein saari information travelClass b add ki h
        let searchUrl = `/flights?origin=${origin}&destination=${destination}&date=${departureDate}&passengers=${passengers}&travelClass=${travelClass}`;
        
        // Agar round trip hai to return date bhi add karein
        if (tripType === 'round-trip' && returnDate) {
            searchUrl += `&returnDate=${returnDate}`;
        }
        navigate(searchUrl);
    };

    // Min.. date ko aaj par set kiya 
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="card shadow-lg p-4" style={{ borderRadius: '15px' }}>
            <div className="card-body">
                <h3 className="card-title text-center mb-4" style={{ color: 'var(--secondary-color)' }}>Search for Flights</h3>
                
                {/* Trip type radio buttons */}
                <div className="d-flex justify-content-center mb-3">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="tripType" id="one-way" value="one-way" checked={tripType === 'one-way'} onChange={() => setTripType('one-way')} />
                        <label className="form-check-label" htmlFor="one-way">One Way</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="tripType" id="round-trip" value="round-trip" checked={tripType === 'round-trip'} onChange={() => setTripType('round-trip')} />
                        <label className="form-check-label" htmlFor="round-trip">Round Trip</label>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row g-3 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label">From</label>
                            <select className="form-select" value={origin} onChange={handleOriginChange} required>
                                <option value="">Select Origin</option>
                                {Object.keys(pakistaniCities).map(city => (
                                    <option key={city} value={city} disabled={city === destination}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">To</label>
                            <select className="form-select" value={destination} onChange={handleDestinationChange} required>
                                <option value="">Select Destination</option>
                                {Object.keys(pakistaniCities).map(city => (
                                    <option key={city} value={city} disabled={city === origin}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Departure Date</label>
                            <input type="date" className="form-control" value={departureDate} min={today} onChange={(e) => setDepartureDate(e.target.value)} required />
                        </div>
                        {tripType === 'round-trip' && (
                            <div className="col-md-4">
                                <label className="form-label">Return Date</label>
                                <input type="date" className="form-control" value={returnDate} min={departureDate} onChange={(e) => setReturnDate(e.target.value)} required />
                            </div>
                        )}
                        <div className="col-md-4">
                            <label className="form-label">Passengers</label>
                             <input type="number" className="form-control" value={passengers} onChange={(e) => setPassengers(e.target.value)} min="1"  required />   {/*no of passengers}  */}
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Class</label>
                            <select className="form-select" value={travelClass} onChange={(e) => setTravelClass(e.target.value)}>
                                <option value="Economy">Economy</option>
                                <option value="Business">Business</option>
                                <option value="First">First</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <button type="submit" className="btn btn-primary w-100">Search Flights</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FlightSearchForm;