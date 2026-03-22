const Attendee = require('../models/Attendee');

const registerForEvent = async (req, res) => {
    try {
        const { eventId, userName, userEmail } = req.body;
        const userId = req.user.userId;

        // Check if already registered
        const existing = await Attendee.findOne({ where: { eventId, userId } });
        if (existing) {
            return res.status(400).json({ message: 'You have already registered for this event.' });
        }

        const attendee = await Attendee.create({
            eventId,
            userId,
            userName,
            userEmail,
            status: 'REGISTERED'
        });

        res.status(201).json(attendee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEventAttendees = async (req, res) => {
    try {
        const { eventId } = req.params;
        const attendees = await Attendee.findAll({ where: { eventId } });
        res.json(attendees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const attendee = await Attendee.findByPk(id);
        if (!attendee) return res.status(404).json({ message: 'Attendee not found' });

        attendee.status = status;
        await attendee.save();

        res.json(attendee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyEvents = async (req, res) => {
    try {
        const userId = req.user.userId;
        const myEvents = await Attendee.findAll({ where: { userId } });
        res.json(myEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerForEvent,
    getEventAttendees,
    updateStatus,
    getMyEvents
};
