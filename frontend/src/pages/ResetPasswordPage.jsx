import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'; 

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); 
    const [status, setStatus] = useState({ type: '', msg: '' });
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'info', msg: 'Resetting password...' });
        try {
            const res = await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, { password });
            setStatus({ type: 'success', msg: res.data.msg });
            setTimeout(() => navigate('/auth'), 3000);
        } catch (error) {
            setStatus({ type: 'error', msg: error.response?.data?.msg || 'Something went wrong.' });
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg" style={{ width: '400px' }}>
                <div className="card-body p-5">
                    <h2 className="card-title text-center mb-4">Reset Your Password</h2>
                    {status.msg && (
                        <div className={`alert ${status.type === 'success' ? 'alert-success' : (status.type === 'error' ? 'alert-danger' : 'alert-info')}`}>
                            {status.msg}
                        </div>
                    )}
                    
                    {/* Sirf tab form dikhayein jab password reset na hua ho */}
                    {status.type !== 'success' && (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">New Password</label>
                                <div className="input-group">
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span className="input-group-text" onClick={() => setPasswordVisible(!passwordVisible)} style={{ cursor: 'pointer' }}>
                                        {passwordVisible ? <EyeSlashFill /> : <EyeFill />}
                                    </span>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Reset Password</button>
                        </form>
                    )}

                    {/* Jab password reset ho jaye to login ka link dikhayein */}
                    {status.type === 'success' && (
                        <div className="text-center">
                            <Link to="/auth" className="btn btn-success">Go to Login</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;