import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';

function RegisterPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState(''); 
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await axios.post('http://localhost:5000/api/users/register', { name, email, password, inviteCode });
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/auth'), 2000);
        } catch (err) { setError(err.response?.data?.msg || "Registration failed."); }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg" style={{ width: '400px', borderRadius: '15px' }}>
                <div className="card-body p-5">
                    <h2 className="card-title text-center mb-4" style={{ color: 'var(--primary-color)' }}>Create Your Account</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3"><label>Name</label><input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required /></div>
                        <div className="mb-3"><label>Email</label><input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                        <div className="mb-3"><label>Password</label><div className="input-group"><input type={passwordVisible ? 'text' : 'password'} className="form-control" value={password} onChange={e => setPassword(e.target.value)} required /><span className="input-group-text" onClick={() => setPasswordVisible(!passwordVisible)} style={{ cursor: 'pointer' }}>{passwordVisible ? <EyeSlashFill /> : <EyeFill />}</span></div></div>
                        <div className="mb-3">
                            <label className="form-label">Admin Invite Code <span className="text-muted">(Optional)</span></label>
                            <input type="text" className="form-control" value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Enter code to register as admin" />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Register</button>
                    </form>
                    <p className="mt-3 text-center">Already have an account? <Link to="/auth">Login here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;