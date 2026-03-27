import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass" style={{
            margin: '1rem 2rem',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Link to="/" style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
                EventZen
            </Link>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/dashboard" style={{ color: '#ccc' }}>Dashboard</Link>
                        <Link to="/events" style={{ color: '#ccc' }}>All Events</Link>
                        {user.role === 'ADMIN' && (
                            <Link to="/admin" style={{ color: '#ccc' }}>Admin Panel</Link>
                        )}
                        <span style={{ color: 'var(--text-muted)' }}>
                            Welcome, <span style={{ color: 'white' }}>{user.sub.split('@')[0]}</span>
                        </span>
                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.1)', 
                            color: '#ccc', 
                            padding: '4px 12px', 
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            {user.role}
                        </div>
                        <button onClick={handleLogout} className="btn" style={{ 
                            padding: '0.4rem 0.8rem', 
                            background: 'transparent', 
                            color: '#ccc', 
                            border: '1px solid rgba(255,255,255,0.2)' 
                        }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn" style={{ background: 'transparent', color: 'white' }}>Login</Link>
                        <Link to="/register" className="btn btn-primary">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
