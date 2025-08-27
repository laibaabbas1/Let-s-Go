import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';

function AuthPage() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isUserView, setIsUserView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
            login(res.data.user, res.data.token);
            
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.msg || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg" style={{ width: '400px', borderRadius: '15px' }}>
                <div className="card-body p-5">
                    
                    <h2 className="card-title text-center mb-4" style={{ color: 'var(--primary-color)' /* Teal Green */ }}>
                        {isUserView ? 'User Login' : 'Admin Login'}
                    </h2>
                    
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <div className="input-group">
                                <input type={passwordVisible ? 'text' : 'password'} className="form-control" onChange={(e) => setPassword(e.target.value)} required />
                                <span className="input-group-text" onClick={() => setPasswordVisible(!passwordVisible)} style={{ cursor: 'pointer' }}>
                                    {passwordVisible ? <EyeSlashFill /> : <EyeFill />}
                                </span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <Link to="/forgot-password" className="small">Forgot Password?</Link>
                            
                            {isUserView && <Link to="/register" className="small">Create an account</Link>}
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                    
                    <hr className="my-4" />
                    
                    <div className="text-center">
                        <p className="mb-0">
                            {isUserView ? "Are you an Admin?" : "Are you a User?"}
                            <button className="btn btn-link" onClick={() => setIsUserView(!isUserView)}>
                                Click here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;