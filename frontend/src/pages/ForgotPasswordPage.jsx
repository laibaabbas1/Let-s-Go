import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'info', msg: 'Sending request...' });
        try {
            const res = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
            setStatus({ type: 'success', msg: res.data.msg });
        } catch (error) {
            setStatus({ type: 'error', msg: error.response?.data?.msg || 'Something went wrong.' });
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg" style={{ width: '400px' }}>
                <div className="card-body p-5">
                    <h2 className="card-title text-center mb-4">Forgot Password</h2>
                    <p className="text-muted text-center mb-4">
                        Enter your email address and we will send you a link to reset your password.
                    </p>

                    {status.msg && (
                        <div className={`alert ${status.type === 'success' ? 'alert-success' : (status.type === 'error' ? 'alert-danger' : 'alert-info')}`}>
                            {status.msg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>
                    </form>
                    <p className="mt-3 text-center">
                        Remembered your password? <Link to="/auth">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;