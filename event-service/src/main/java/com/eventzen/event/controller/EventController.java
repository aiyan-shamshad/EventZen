package com.eventzen.event.controller;

import com.eventzen.event.dto.EventRequest;
import com.eventzen.event.dto.EventResponse;
import com.eventzen.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public EventResponse createEvent(@Valid @RequestBody EventRequest request) {
        Long organizerId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return eventService.createEvent(request, organizerId);
    }

    @GetMapping
    public Page<EventResponse> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return eventService.getAllEvents(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public EventResponse getEventById(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    @PostMapping("/{eventId}/vendors/{vendorId}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public EventResponse assignVendor(@PathVariable Long eventId, @PathVariable Long vendorId) {
        return eventService.assignVendor(eventId, vendorId);
    }
}
