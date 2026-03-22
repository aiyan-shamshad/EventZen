import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const CreateEvent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [maxAttendees, setMaxAttendees] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Send payload to Event Service (Java)
            const res = await api.post('/events', {
                title,
                description,
                startDate: startDate.length === 16 ? startDate + ':00' : startDate.slice(0, 19),
                endDate: endDate.length === 16 ? endDate + ':00' : endDate.slice(0, 19),
                status: 'PUBLISHED',
                maxAttendees: maxAttendees ? parseInt(maxAttendees) : null
            });
            
            // Navigate to the newly created event details page
            navigate(`/events/${res.data.id}`);
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) {
                // If Spring Boot returns a map of validation errors
                const errorMessages = Object.values(data.errors).join(', ');
                setError(errorMessages);
            } else {
                setError(data?.message || 'Failed to create event.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
            <div className="glass" style={{ padding: '3rem' }}>
                <h2 style={{ marginBottom: '2rem' }}>Create New Event</h2>
                
                {error && <div style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Event Title</label>
                        <input type="text" className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <label>Description</label>
                        <textarea className="input" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label>Start Date & Time</label>
                            <input type="datetime-local" className="input" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>End Date & Time</label>
                            <input type="datetime-local" className="input" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: '2rem' }}>
                        <label>Maximum Attendees (Optional)</label>
                        <input type="number" className="input" min="1" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn" onClick={() => navigate('/events')} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'white' }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Publishing...' : 'Publish Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
