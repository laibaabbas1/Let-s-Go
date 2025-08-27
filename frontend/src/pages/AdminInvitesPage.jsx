import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { Button, Card, Alert, InputGroup, Form } from 'react-bootstrap';
import { Clipboard } from 'react-bootstrap-icons';

function AdminInvitesPage() {
    const [inviteCode, setInviteCode] = useState('');
    const [status, setStatus] = useState({ msg: '', type: '' });
    const { token } = useContext(AuthContext);

    const generateInvite = async () => {
        setStatus({ msg: 'Generating code...', type: 'info' });
        try {
            const response = await axios.post('http://localhost:5000/api/users/generate-invite', {}, { headers: { Authorization: `Bearer ${token}` } });
            setInviteCode(response.data.invite.token);
            setStatus({ msg: 'Code generated! It will expire in 24 hours.', type: 'success' });
        } catch (error) { setStatus({ msg: 'Failed to generate code.', type: 'danger' }); }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteCode);
        alert('Code copied to clipboard!');
    };

    return (
        <div>
            <h2 style={{ color: 'var(--primary-color)' }}>Admin Invite System</h2>
            <p className="text-muted">Generate a single-use code to invite a new admin.</p>
            <Card>
                <Card.Body>
                    <Card.Title>Generate New Invite Code</Card.Title>
                    <Button onClick={generateInvite} variant="primary">Generate Code</Button>
                    {status.msg && <Alert variant={status.type} className="mt-3">{status.msg}</Alert>}
                    {inviteCode && (
                        <div className="mt-3">
                            <h5>Your New Invite Code:</h5>
                            <InputGroup>
                                <Form.Control value={inviteCode} readOnly />
                                <Button variant="outline-secondary" onClick={copyToClipboard}><Clipboard /></Button>
                            </InputGroup>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default AdminInvitesPage;