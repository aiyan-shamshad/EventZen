import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await api.delete(`/events/${eventId}`);
            fetchEvents();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete event');
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            // Spring Boot pagination (page 0)
            const res = await api.get('/events?page=0&size=20');
            // Depending on how Spring Boot Page is returned, it might be res.data.content
            setEvents(res.data.content || res.data);
        } catch (err) {
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container">Loading events...</div>;

    return (
        <div className="animate-fade-in" style={{ paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>All Events</h2>
                {['ORGANIZER', 'ADMIN'].includes(user?.role) && (
                    <Link to="/events/new" className="btn btn-primary">Create Event</Link>
                )}
            </div>

            {events.length === 0 ? (
                <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '1.1rem', opacity: 0.5, marginBottom: '1rem' }}>📅</p>
                    <p>No events found. Check back later!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {events.map(event => (
                        <div key={event.id} className="glass" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{event.title}</h3>
                                <span style={{ 
                                    display: 'inline-block',
                                    marginTop: '0.5rem',
                                    fontSize: '0.75rem', 
                                    padding: '2px 8px', 
                                    background: event.status === 'PUBLISHED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                                    color: event.status === 'PUBLISHED' ? 'var(--success)' : 'var(--primary)',
                                    borderRadius: '12px'
                                }}>
                                    {event.status || 'DRAFT'}
                                </span>
                            </div>
                            <div style={{ padding: '1.5rem', flex: 1 }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    • {new Date(event.startDate).toLocaleDateString()}
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    • {event.maxAttendees ? `Max ${event.maxAttendees} people` : 'Unlimited capacity'}
                                </p>
                                {event.organizerName && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        • Organized by <strong style={{ color: 'white' }}>{event.organizerName}</strong>
                                    </p>
                                )}
                            </div>
                            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                                <Link to={`/events/${event.id}`} className="btn" style={{ flex: 1, border: '1px solid var(--border-color)', color: 'white', textAlign: 'center' }}>
                                    View Details
                                </Link>
                                {(user?.role === 'ADMIN' || (user?.role === 'ORGANIZER' && event.organizerId === user?.userId)) && (
                                    <button onClick={() => handleDeleteEvent(event.id)} className="btn" style={{ 
                                        padding: '0.4rem 0.8rem', 
                                        background: 'rgba(255,68,68,0.1)', 
                                        color: 'var(--danger)', 
                                        border: '1px solid rgba(255,68,68,0.3)' 
                                    }}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
