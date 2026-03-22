import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ATTENDEE');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setError('');
        try {
            await register(name, email, password, role);
            navigate('/dashboard');
        } catch (err) {
            console.error("Registration Error", err);
            setError(err.response?.data?.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5vh' }} className="animate-fade-in">
            <div className="glass" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
                
                {error && <div style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" />
                    </div>

                    <div className="input-group" style={{ marginBottom: '2rem' }}>
                        <label>I want to sign up as a:</label>
                        <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="ATTENDEE">Guest / Attendee</option>
                            <option value="ORGANIZER">Event Organizer</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
