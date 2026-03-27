import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [budget, setBudget] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionMsg, setActionMsg] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    
    // Budget Form States
    const [newBudgetAmount, setNewBudgetAmount] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('VENUE');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [customExpenseDesc, setCustomExpenseDesc] = useState('');
    const [expenses, setExpenses] = useState([]);
    
    const { user } = useAuth();

    const fetchBudgetData = async () => {
        try {
            const budgetRes = await api.get(`/budget/event/${id}/report`);
            setBudget(budgetRes.data);
            if (budgetRes.data?.budgetId) {
                const expRes = await api.get(`/budget/${budgetRes.data.budgetId}/expenses`);
                setExpenses(expRes.data);
            }
        } catch (e) {
            console.warn('Budget not found');
        }
    };

    useEffect(() => {
        const loadEventData = async () => {
            try {
                // 1. Fetch from Event Service (Java)
                const eventRes = await api.get(`/events/${id}`);
                setEvent(eventRes.data);

                // 2. Fetch from Budget Service (Node.js) - Organizer only
                if (['ORGANIZER', 'ADMIN'].includes(user?.role)) {
                    await fetchBudgetData();
                    try {
                        const attendeesRes = await api.get(`/attendees/event/${id}`);
                        setAttendees(attendeesRes.data);
                    } catch (e) {
                        console.warn('Could not load attendees', e);
                    }
                } else if (user?.role === 'ATTENDEE') {
                    // Fetch from Attendee Service to see if current user is registered
                    try {
                        const myEventsRes = await api.get('/attendees/my-events');
                        const registered = myEventsRes.data.some(att => att.eventId == id);
                        setIsRegistered(registered);
                    } catch (e) {
                        console.warn('Could not check registration status', e);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadEventData();
    }, [id, user]);

    const handleRSVP = async () => {
        try {
            await api.post('/attendees/register', {
                eventId: id,
                userName: user.sub,
                userEmail: user.sub
            });
            setActionMsg('Successfully registered for this event!');
            setIsRegistered(true);
        } catch (err) {
            setActionMsg(err.response?.data?.message || 'Failed to register');
        }
    };

    const handleSetBudget = async (e) => {
        e.preventDefault();
        try {
            await api.post('/budget', { eventId: id, totalBudget: parseFloat(newBudgetAmount) });
            await fetchBudgetData();
            setNewBudgetAmount('');
        } catch (err) { alert('Failed to set budget'); }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        const amountNum = parseFloat(expenseAmount);
        
        if (amountNum > budget.remaining) {
            alert("Error: Expense exceeds the remaining budget! Please remove existing expenses or reduce the amount.");
            return;
        }

        try {
            await api.post('/budget/expense', {
                budgetId: budget.budgetId,
                category: expenseCategory,
                description: expenseCategory === 'OTHER' ? customExpenseDesc : expenseCategory,
                amount: amountNum,
                expenseDate: new Date().toISOString().split('T')[0]
            });
            await fetchBudgetData();
            setExpenseAmount('');
            setCustomExpenseDesc('');
            setExpenseCategory('VENUE');
        } catch (err) { alert('Failed to add expense'); }
    };

    const handleRemoveExpense = async (expenseId) => {
        try {
            await api.delete(`/budget/expense/${expenseId}`);
            await fetchBudgetData();
        } catch (err) { alert('Failed to remove expense'); }
    };

    if (loading) return <div className="container">Loading details...</div>;
    if (!event) return <div className="container">Event not found.</div>;

    const isOrganizer = ['ORGANIZER', 'ADMIN'].includes(user?.role);
    const canDelete = user?.role === 'ADMIN' || (user?.role === 'ORGANIZER' && event.organizerId === user?.userId);

    const handleDeleteEvent = async () => {
        if (!window.confirm('Are you sure you want to permanently delete this event?')) return;
        try {
            await api.delete(`/events/${id}`);
            navigate('/events');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete event');
        }
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <div className="glass" style={{ padding: '3rem', marginBottom: '2rem', marginTop: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>{event.title}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '800px' }}>
                    {event.description || 'No description provided for this event.'}
                </p>
                
                <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        • <span>{new Date(event.startDate).toLocaleString()}</span>
                    </div>
                    {event.organizerName && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            • <span>Organized by <strong>{event.organizerName}</strong></span>
                        </div>
                    )}
                    {canDelete && (
                        <button onClick={handleDeleteEvent} className="btn" style={{ 
                            marginLeft: 'auto',
                            padding: '0.4rem 1rem', 
                            background: 'rgba(255,68,68,0.1)', 
                            color: 'var(--danger)', 
                            border: '1px solid rgba(255,68,68,0.3)' 
                        }}>
                            Delete Event
                        </button>
                    )}
                </div>

                {!isOrganizer && (
                    <div style={{ marginTop: '3rem' }}>
                        {isRegistered ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '1rem 2rem', background: 'rgba(255, 255, 255, 0.1)', color: 'var(--success)', borderRadius: '8px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' }}>
                                ✓ You are Registered!
                            </div>
                        ) : (
                            <button onClick={handleRSVP} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                                RSVP Now
                            </button>
                        )}
                        {actionMsg && <p style={{ marginTop: '1rem', color: 'var(--success)' }}>{actionMsg}</p>}
                    </div>
                )}
            </div>

            {/* Organizer Hub: Aggregates Node.js Microservices */}
            {isOrganizer && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                    
                    {/* Attendee Service Micro-UI */}
                    <div className="glass" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>👥 Attendees ({attendees.length})</h3>
                        </div>
                        {attendees.length > 0 ? (
                            <ul style={{ listStyle: 'none' }}>
                                {attendees.map(a => (
                                    <li key={a.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', marginBottom: '0.5rem', borderRadius: '8px' }}>
                                        <strong>{a.userName}</strong> ({a.status})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>No attendees registered yet.</p>
                        )}
                    </div>

                    {/* Budget Service Micro-UI */}
                    <div className="glass" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>💰 Budget Tracker</h3>
                        </div>
                        {budget ? (
                            <div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span>Total: ${budget.totalBudget}</span>
                                        <span style={{ color: budget.remaining < 0 ? 'var(--danger)' : 'var(--success)' }}>
                                            Remaining: ${budget.remaining}
                                        </span>
                                    </div>
                                    <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                                        <div style={{ 
                                            width: `${Math.min(100, (budget.totalSpent / budget.totalBudget) * 100)}%`, 
                                            height: '100%', 
                                            background: budget.remaining < 0 ? 'var(--danger)' : 'var(--primary)',
                                            transition: 'width 0.5s ease'
                                        }} />
                                    </div>
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Spent: ${budget.totalSpent} on {budget.expensesCount} items</p>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                                    <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Log Expense</h4>
                                    <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <select className="input" value={expenseCategory} onChange={e => setExpenseCategory(e.target.value)} required style={{ flex: 1, minWidth: '120px', padding: '0.4rem' }}>
                                            <option value="VENUE">Venue</option>
                                            <option value="CATERING">Catering</option>
                                            <option value="MARKETING">Marketing</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                        
                                        {expenseCategory === 'OTHER' && (
                                            <input type="text" placeholder="Expense Description" className="input" value={customExpenseDesc} onChange={e => setCustomExpenseDesc(e.target.value)} required style={{ flex: 2, minWidth: '150px', padding: '0.4rem' }} />
                                        )}

                                        <input type="number" placeholder="$ Amount" className="input" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} required style={{ width: '100px', padding: '0.4rem' }} />
                                        <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>Add</button>
                                    </form>
                                    
                                    {expenses.length > 0 && (
                                        <div style={{ marginTop: '1.5rem' }}>
                                            <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Recent Expenses</h4>
                                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                                {expenses.map(exp => (
                                                    <li key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', marginBottom: '0.5rem', borderRadius: '8px' }}>
                                                        <div>
                                                            <strong style={{ color: 'white' }}>{exp.description || exp.category}</strong>
                                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '8px' }}>{new Date(exp.expenseDate).toLocaleDateString()}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                            <strong style={{ color: 'var(--danger)' }}>-${exp.amount}</strong>
                                                            <button onClick={() => handleRemoveExpense(exp.id)} className="btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', border: 'none' }}>Remove</button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Budget limit is not set for this event.</p>
                                <form onSubmit={handleSetBudget} style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input type="number" placeholder="Total Budget $" className="input" value={newBudgetAmount} onChange={e => setNewBudgetAmount(e.target.value)} required style={{ flex: 1 }} />
                                    <button type="submit" className="btn btn-primary">Allocate</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetails;
