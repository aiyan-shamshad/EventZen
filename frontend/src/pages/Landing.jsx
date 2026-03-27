import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="landing-container" style={{ color: 'white' }}>
            {/* Hero Section */}
            <header style={{ 
                minHeight: '90vh', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Subtle animated background blobs */}
                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    background: '#ffffff',
                    filter: 'blur(120px)',
                    opacity: 0.05,
                    borderRadius: '50%',
                    animation: 'float 20s infinite alternate'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '10%',
                    width: '400px',
                    height: '400px',
                    background: '#ffffff',
                    filter: 'blur(140px)',
                    opacity: 0.04,
                    borderRadius: '50%',
                    animation: 'float 15s infinite alternate-reverse'
                }} />

                <div className="animate-fade-in">
                    <span style={{ 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        color: '#ccc', 
                        padding: '0.5rem 1.5rem', 
                        borderRadius: '30px', 
                        fontSize: '0.9rem', 
                        fontWeight: 'bold',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        marginBottom: '2rem',
                        display: 'inline-block'
                    }}>
                        Event Management Platform
                    </span>
                    <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem' }}>
                        Host Events that <br />
                        <span style={{ color: '#ccc' }}>Actually Matter</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
                        The complete microservices-powered platform for organizing, tracking, and budgeting your events with precision.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px' }}>
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px' }}>
                                    Get Started →
                                </Link>
                                <Link to="/login" className="btn" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'white' }}>
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>
            {/* Features Section */}
            <section style={{ padding: '6rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <FeatureCard 
                            title="Real-time Tracking"
                            description="Monitor attendee registrations and budget updates in real-time across decentralized services."
                        />
                        <FeatureCard 
                            title="Secure Identity"
                            description="JWT-powered authentication ensuring zero-trust security for organizers and attendees."
                        />
                        <FeatureCard 
                            title="Budget Intelligence"
                            description="Visualize your event spending with detailed analytics and automated expense logging."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ title, description }) => (
    <div className="glass" style={{ padding: '2.5rem', transition: 'transform 0.3s ease, border-color 0.3s ease', cursor: 'default' }} 
         onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }} 
         onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{description}</p>
    </div>
);

export default Landing;
