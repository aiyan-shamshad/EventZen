import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

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
                    <button className="btn btn-primary">Create Event</button>
                )}
            </div>

            {events.length === 0 ? (
                <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
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
                                    <Calendar size={16} /> 
                                    {new Date(event.startDate).toLocaleDateString()}
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Users size={16} /> 
                                    {event.maxAttendees ? `Max ${event.maxAttendees} people` : 'Unlimited capacity'}
                                </p>
                            </div>
                            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                                <Link to={`/events/${event.id}`} className="btn" style={{ width: '100%', border: '1px solid var(--primary)', color: 'white' }}>
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
