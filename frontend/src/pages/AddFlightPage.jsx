import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddFlightPage() {
    // Basic flight details ke liye state
    const [flightData, setFlightData] = useState({
        flightNumber: '',
        airline: '',
        origin: 'Karachi',
        destination: 'Lahore',
        departureTime: '',
        arrivalTime: '',
    });

    // Travel classes ke liye nayi state
    const [travelClasses, setTravelClasses] = useState([
        { className: 'Economy', price: '', seatsAvailable: '' },
        { className: 'Business', price: '', seatsAvailable: '' },
        { className: 'First', price: '', seatsAvailable: '' }
    ]);

    const [airlineLogo, setAirlineLogo] = useState(null);
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    // Basic details change karne ke liye
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFlightData(prevState => ({ ...prevState, [name]: value }));
    };

    // Travel class ki details (price/seats) change karne ke liye
    const handleClassChange = (index, event) => {
        const values = [...travelClasses];
        values[index][event.target.name] = event.target.value;
        setTravelClasses(values);
    };

    const handleFileChange = (e) => {
        setAirlineLogo(e.target.files[0]);
    };

    // Form submit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Adding flight...');

        const formData = new FormData();
        // Basic details
        Object.keys(flightData).forEach(key => {
            formData.append(key, flightData[key]);
        });

        // Travel classes ke array ko JSON string banane k lie
        formData.append('travelClasses', JSON.stringify(travelClasses));

        formData.append('airlineLogo', airlineLogo);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/flights/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            setStatus('Flight added successfully!');
            setTimeout(() => navigate('/admin/flights'), 2000);

        } catch (error) {
            setStatus('Error adding flight. Please check all details and try again.');
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    const pakistaniCities = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta", "Multan", "Faisalabad", "Sialkot", "Sukkur"];

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-lg">
                        <div className="card-body p-5">
                            <h2 className="card-title text-center mb-4" style={{ color: 'var(--primary-color)' }}>
                                Add New Flight
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="flightNumber" className="form-label">Flight Number</label>
                                        <input type="text" className="form-control" name="flightNumber" onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="airline" className="form-label">Airline Name</label>
                                        <input type="text" className="form-control" name="airline" onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="airlineLogo" className="form-label">Airline Logo</label>
                                    <input type="file" className="form-control" name="airlineLogo" onChange={handleFileChange} required />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="origin" className="form-label">Origin</label>
                                        <select className="form-select" name="origin" value={flightData.origin} onChange={handleChange}>
                                            {pakistaniCities.map(city => <option key={city} value={city}>{city}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="destination" className="form-label">Destination</label>
                                        <select className="form-select" name="destination" value={flightData.destination} onChange={handleChange}>
                                            {pakistaniCities.map(city => <option key={city} value={city}>{city}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="departureTime" className="form-label">Departure Time</label>
                                        <input type="datetime-local" className="form-control" name="departureTime" onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="arrivalTime" className="form-label">Arrival Time</label>
                                        <input type="datetime-local" className="form-control" name="arrivalTime" onChange={handleChange} required />
                                    </div>
                                </div>

                                <hr className="my-4" />
                                <h4 className="mb-3">Travel Classes</h4>

                                {travelClasses.map((travelClass, index) => (
                                    <div key={index} className="row mb-3 align-items-center">
                                        <label className="col-md-2 col-form-label fw-bold">{travelClass.className}</label>
                                        <div className="col-md-5">
                                            <input
                                                type="number"
                                                name="price"
                                                className="form-control"
                                                placeholder="Price (PKR)"
                                                value={travelClass.price}
                                                onChange={event => handleClassChange(index, event)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-5">
                                            <input
                                                type="number"
                                                name="seatsAvailable"
                                                className="form-control"
                                                placeholder="Seats Available"
                                                value={travelClass.seatsAvailable}
                                                onChange={event => handleClassChange(index, event)}
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button type="submit" className="btn btn-primary w-100 mt-4">Add Flight</button>
                            </form>
                            {status && <div className="alert alert-info mt-3">{status}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddFlightPage;