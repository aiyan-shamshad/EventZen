package com.eventzen.event.service;

import com.eventzen.event.client.AuthServiceClient;
import com.eventzen.event.dto.EventRequest;
import com.eventzen.event.dto.EventResponse;
import com.eventzen.event.mapper.EventMapper;
import com.eventzen.event.model.Event;
import com.eventzen.event.model.EventStatus;
import com.eventzen.event.model.Vendor;
import com.eventzen.event.model.Venue;
import com.eventzen.event.repository.EventRepository;
import com.eventzen.event.repository.VendorRepository;
import com.eventzen.event.repository.VenueRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;
    private final VendorRepository vendorRepository;
    private final EventMapper eventMapper;
    private final AuthProxy authProxy;
    private final HttpServletRequest request;

    /**
     * Helper to get the token for OpenFeign requests.
     */
    private String getAuthToken() {
        return request.getHeader("Authorization");
    }

    /**
     * Create a new event.
     */
    public EventResponse createEvent(EventRequest req, Long organizerId) {
        Event event = Event.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .organizerId(organizerId)
                .status(req.getStatus() != null ? req.getStatus() : EventStatus.DRAFT)
                .maxAttendees(req.getMaxAttendees())
                .build();

        if (req.getVenueId() != null) {
            Venue venue = venueRepository.findById(req.getVenueId())
                    .orElseThrow(() -> new RuntimeException("Venue not found: " + req.getVenueId()));
            event.setVenue(venue);
        }

        Event savedEvent = eventRepository.save(event);
        return populateOrganizerName(eventMapper.toResponse(savedEvent));
    }

    /**
     * Get paginated events.
     */
    public Page<EventResponse> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable)
                .map(eventMapper::toResponse)
                .map(this::populateOrganizerName);
    }

    /**
     * Get a single event by ID.
     */
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found: " + id));
        return populateOrganizerName(eventMapper.toResponse(event));
    }

    /**
     * Assign a vendor to an event.
     */
    public EventResponse assignVendor(Long eventId, Long vendorId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        event.getVendors().add(vendor);
        Event saved = eventRepository.save(event);
        return populateOrganizerName(eventMapper.toResponse(saved));
    }

    /**
     * Internal helper to fetch organizer details via AuthProxy.
     */
    private EventResponse populateOrganizerName(EventResponse response) {
        if (response.getOrganizerId() != null) {
            AuthServiceClient.UserDto organizer = authProxy.getUserById(
                    response.getOrganizerId(), getAuthToken());
            response.setOrganizerName(organizer.getName());
        }
        return response;
    }
}
