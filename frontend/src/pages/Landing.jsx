import { Link } from 'react-router-dom';
import { Calendar, Users, Shield, Zap, ArrowRight, BarChart3 } from 'lucide-react';
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
                overflow: 'hidden',
                background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)'
            }}>
                {/* Animated background blobs */}
                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'var(--primary)',
                    filter: 'blur(100px)',
                    opacity: 0.15,
                    borderRadius: '50%',
                    animation: 'float 20s infinite alternate'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '10%',
                    width: '400px',
                    height: '400px',
                    background: '#a855f7',
                    filter: 'blur(120px)',
                    opacity: 0.1,
                    borderRadius: '50%',
                    animation: 'float 15s infinite alternate-reverse'
                }} />

                <div className="animate-fade-in">
                    <span style={{ 
                        background: 'rgba(99, 102, 241, 0.1)', 
                        color: 'var(--primary)', 
                        padding: '0.5rem 1.5rem', 
                        borderRadius: '30px', 
                        fontSize: '0.9rem', 
                        fontWeight: 'bold',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        marginBottom: '2rem',
                        display: 'inline-block'
                    }}>
                        Next-Gen Event Management
                    </span>
                    <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem' }}>
                        Host Events that <br />
                        <span style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Actually Matter</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
                        The complete microservices-powered platform for organizing, tracking, and budgeting your events with precision and style.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Go to Dashboard <ArrowRight size={20} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Get Started for Free <ArrowRight size={20} />
                                </Link>
                                <Link to="/login" className="btn" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section style={{ padding: '6rem 2rem', background: 'rgba(0,0,0,0.2)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Engineered for Excellence</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Built on a robust polyglot microservices architecture.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <FeatureCard 
                            icon={<Zap size={32} color="#6366f1" />}
                            title="Real-time Tracking"
                            description="Monitor attendee registrations and budget updates in real-time across decentralized services."
                        />
                        <FeatureCard 
                            icon={<Shield size={32} color="#6366f1" />}
                            title="Secure Identity"
                            description="JWT-powered authentication ensuring zero-trust security for organizers and attendees."
                        />
                        <FeatureCard 
                            icon={<BarChart3 size={32} color="#6366f1" />}
                            title="Budget Intel"
                            description="Visualize your event spending with detailed analytics and automated expense logging."
                        />
                    </div>
                </div>
            </section>

        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="glass" style={{ padding: '2.5rem', transition: 'transform 0.3s ease', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
        <div style={{ marginBottom: '1.5rem', background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px' }}>
            {icon}
        </div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{description}</p>
    </div>
);

const StatItem = ({ value, label }) => (
    <div>
        <div style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white' }}>{value}</div>
        <div style={{ color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>{label}</div>
    </div>
);

export default Landing;
