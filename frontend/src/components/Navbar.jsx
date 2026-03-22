import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, CalendarDays } from 'lucide-react';

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
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
                <CalendarDays className="text-primary" />
                Event<span style={{ color: 'var(--primary)' }}>Zen</span>
            </Link>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/dashboard" style={{ color: 'white', marginRight: '1rem' }}>Dashboard</Link>
                        <Link to="/events" style={{ color: 'white', marginRight: '1rem' }}>All Events</Link>
                        <span style={{ color: 'var(--text-muted)' }}>
                            Welcome, <span style={{ color: 'white' }}>{user.sub.split('@')[0]}</span>
                        </span>
                        <div style={{ 
                            background: 'rgba(99, 102, 241, 0.2)', 
                            color: 'var(--primary)', 
                            padding: '4px 12px', 
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                        }}>
                            {user.role}
                        </div>
                        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }}>
                            <LogOut size={16} style={{ marginRight: '6px' }} />
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
