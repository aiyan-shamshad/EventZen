const express = require('express');
const { registerForEvent, getEventAttendees, updateStatus, getMyEvents } = require('../controllers/attendeeController');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// User routes
router.post('/register', authMiddleware, registerForEvent);
router.get('/my-events', authMiddleware, getMyEvents);

// Organizer / Admin routes
router.get('/event/:eventId', [authMiddleware, authorizeRoles('ORGANIZER', 'ADMIN')], getEventAttendees);
router.put('/:id/status', [authMiddleware, authorizeRoles('ORGANIZER', 'ADMIN')], updateStatus);

module.exports = router;
