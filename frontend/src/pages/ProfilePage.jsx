import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import heroImageUrl from '../assets/aboutuspic.jpg';


function ProfilePage() {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Check karein ke user logged in hai ya nahi
    useEffect(() => {
        if (!user) {
            navigate('/auth'); // Agar user nahi hai, to login page par bhej dein
        }
    }, [user, navigate]);

    const [name, setName] = useState(user ? user.name : '');
    const [imageFile, setImageFile] = useState(null);
    const [status, setStatus] = useState('');

    const bannerStyles = {
        backgroundImage: `url(${heroImageUrl})`,
        height: '50vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
        // Agar user logged in nahi hai, to kuch bhi render na karein
        if(!user) {
            return null;
        }

    const handleSubmit = async (e) => {
            e.preventDefault();
            setStatus('Updating...');
            const formData = new FormData();
            formData.append('name', name);
            if (imageFile) {
                formData.append('profilePicture', imageFile);
            }

            try {
                const token = localStorage.getItem('token');
                const response = await axios.put('http://localhost:5000/api/users/profile', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });

                login(response.data.user, response.data.token);
                setStatus('Profile updated successfully!');
                setImageFile(null); // File input ko reset karein
            } catch (error) {
                setStatus('Failed to update profile.');
                console.error(error);
            }
        };


        return(

            <>
            <div
                style={bannerStyles}
                className="d-flex align-items-center justify-content-center text-white text-center"
            >
                <div>
                    <h1 className="display-4 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        My Profile
                    </h1>
                    <p className="lead" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                        Manage your personal information.
                    </p>
                </div>
            </div>
        <div className = "container my-5" >
            
            <h2 className="mb-4">My Profile</h2>
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 text-center">
                            <img
                                src={imageFile ? URL.createObjectURL(imageFile) : user.profilePicture}
                                alt="Profile"
                                className="img-fluid rounded-circle mb-3"
                                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                            />
                            <h4>{user.name}</h4>
                            <p className="text-muted">{user.email}</p>
                            <p className={`badge ${user.role === 'admin' ? 'bg-success' : 'bg-info'}`}>{user.role}</p>
                        </div>
                        <div className="col-md-8">
                            <h3 style={{ color: 'var(--primary-color)' }}>Edit Your Profile</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Full Name</label>
                                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="profilePicture" className="form-label">Change Profile Picture</label>
                                    <input type="file" className="form-control" onChange={(e) => setImageFile(e.target.files[0])} />
                                </div>
                                <button type="submit" className="btn btn-primary">Update Profile</button>
                            </form>
                            {status && <div className="alert alert-info mt-3">{status}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div >
        </>
    );
}

export default ProfilePage;