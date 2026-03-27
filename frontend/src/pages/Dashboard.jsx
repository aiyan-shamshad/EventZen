import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const Dashboard = () => {
    const { user } = useAuth();
    const [myTickets, setMyTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(false);

    useEffect(() => {
        if (user?.role === 'ATTENDEE') {
            const fetchTickets = async () => {
                setLoadingTickets(true);
                try {
                    // Fetch registered event IDs from Node.js
                    const attendeesRes = await api.get('/attendees/my-events');
                    const eventIds = attendeesRes.data.map(att => att.eventId);

                    // Fetch full event details from Java for each ticket
                    if (eventIds.length > 0) {
                        const eventPromises = eventIds.map(id => api.get(`/events/${id}`));
                        const eventResponses = await Promise.all(eventPromises);
                        setMyTickets(eventResponses.map(res => res.data));
                    }
                } catch (err) {
                    console.error("Failed to load tickets", err);
                } finally {
                    setLoadingTickets(false);
                }
            };
            fetchTickets();
        }
    }, [user]);

    return (
        <div className="animate-fade-in" style={{ paddingTop: '2rem' }}>
            <h2>Dashboard</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Welcome back to your EventZen command center.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                
                {/* Profile Card */}
                <div className="glass" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Profile Overview</h3>
                    <p><strong>Email:</strong> {user?.sub}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                    <div style={{ marginTop: '1.5rem' }}>
                        <span style={{ 
                            background: 'rgba(16, 185, 129, 0.2)', 
                            color: 'var(--success)', 
                            padding: '4px 12px', 
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                        }}>
                            Active Session
                        </span>
                    </div>
                </div>

                {/* Organizer Specific Card */}
                {['ORGANIZER', 'ADMIN'].includes(user?.role) && (
                    <div className="glass" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Organizer Tools</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your events, budgets, and vendors here.</p>
                        <Link to="/events/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create New Event</Link>
                    </div>
                )}

                {/* Admin Specific Card */}
                {user?.role === 'ADMIN' && (
                    <div className="glass" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Admin Controls</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Manage all users, assign roles, and oversee the entire platform.</p>
                        <Link to="/admin" className="btn btn-primary" style={{ marginTop: '1rem' }}>Open Admin Panel</Link>
                    </div>
                )}

                {/* Attendee Specific Card */}
                {user?.role === 'ATTENDEE' && (
                    <div className="glass" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>My Tickets</h3>
                        {loadingTickets ? (
                            <p style={{ color: 'var(--text-muted)' }}>Loading your tickets...</p>
                        ) : myTickets.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {myTickets.map(ticket => (
                                    <li key={ticket.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', marginBottom: '0.5rem', borderRadius: '8px' }}>
                                        <Link to={`/events/${ticket.id}`} style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                                            {ticket.title}
                                        </Link>
                                        <br />
                                        <small style={{ color: 'var(--text-muted)' }}>{new Date(ticket.startDate).toLocaleDateString()}</small>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>You have not registered for any upcoming events yet.</p>
                        )}
                        <Link to="/events" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Browse Events</Link>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;
