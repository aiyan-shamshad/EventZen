import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionMsg, setActionMsg] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchUsers();
        fetchEvents();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events?page=0&size=100');
            setEvents(res.data.content || res.data);
        } catch (err) {
            console.error('Failed to fetch events:', err);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/auth/users/${userId}`, { role: newRole });
            setActionMsg(`User #${userId} role updated to ${newRole}`);
            fetchUsers();
            setTimeout(() => setActionMsg(''), 3000);
        } catch (err) {
            alert('Failed to update role: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteUser = async (userId, email) => {
        if (!window.confirm(`Are you sure you want to permanently delete user "${email}"?`)) return;
        try {
            await api.delete(`/auth/users/${userId}`);
            setActionMsg(`User "${email}" has been deleted.`);
            fetchUsers();
            setTimeout(() => setActionMsg(''), 3000);
        } catch (err) {
            alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteEvent = async (eventId, title) => {
        if (!window.confirm(`Are you sure you want to permanently delete event "${title}"?`)) return;
        try {
            await api.delete(`/events/${eventId}`);
            setActionMsg(`Event "${title}" has been deleted.`);
            fetchEvents();
            setTimeout(() => setActionMsg(''), 3000);
        } catch (err) {
            alert('Failed to delete event: ' + (err.response?.data?.message || err.message));
        }
    };

    if (user?.role !== 'ADMIN') {
        return (
            <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h2>Access Denied</h2>
                <p style={{ color: 'var(--text-muted)' }}>You do not have permission to view this page.</p>
            </div>
        );
    }

    if (loading) return <div className="container">Loading...</div>;

    const admins = users.filter(u => u.role === 'ADMIN');
    const organizers = users.filter(u => u.role === 'ORGANIZER');
    const attendees = users.filter(u => u.role === 'ATTENDEE');

    return (
        <div className="animate-fade-in" style={{ paddingTop: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2>Admin Panel</h2>
                <p style={{ color: 'var(--text-muted)' }}>Manage all users, events, and system access.</p>
            </div>

            {actionMsg && (
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', marginBottom: '1.5rem', color: 'var(--success)' }}>
                    {actionMsg}
                </div>
            )}

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{users.length}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Users</div>
                </div>
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{admins.length}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Admins</div>
                </div>
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{organizers.length}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Organizers</div>
                </div>
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{attendees.length}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Attendees</div>
                </div>
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{events.length}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Events</div>
                </div>
            </div>

            {/* Users Table */}
            <div className="glass" style={{ padding: '2rem', overflowX: 'auto', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>All Users</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem' }}>ID</th>
                            <th style={{ padding: '0.75rem' }}>Name</th>
                            <th style={{ padding: '0.75rem' }}>Email</th>
                            <th style={{ padding: '0.75rem' }}>Role</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>#{u.id}</td>
                                <td style={{ padding: '0.75rem' }}>{u.name}</td>
                                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <select 
                                        className="input" 
                                        value={u.role} 
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', minWidth: '120px' }}
                                    >
                                        <option value="ATTENDEE">ATTENDEE</option>
                                        <option value="ORGANIZER">ORGANIZER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                    <button 
                                        onClick={() => handleDeleteUser(u.id, u.email)} 
                                        className="btn" 
                                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: 'rgba(255,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(255,68,68,0.3)' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Events Table */}
            <div className="glass" style={{ padding: '2rem', overflowX: 'auto' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>All Events</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem' }}>ID</th>
                            <th style={{ padding: '0.75rem' }}>Title</th>
                            <th style={{ padding: '0.75rem' }}>Organizer</th>
                            <th style={{ padding: '0.75rem' }}>Date</th>
                            <th style={{ padding: '0.75rem' }}>Status</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(ev => (
                            <tr key={ev.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>#{ev.id}</td>
                                <td style={{ padding: '0.75rem' }}>{ev.title}</td>
                                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{ev.organizerName || `User #${ev.organizerId}`}</td>
                                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{new Date(ev.startDate).toLocaleDateString()}</td>
                                <td style={{ padding: '0.75rem' }}>{ev.status || 'DRAFT'}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <button 
                                        onClick={() => handleDeleteEvent(ev.id, ev.title)} 
                                        className="btn" 
                                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: 'rgba(255,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(255,68,68,0.3)' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
