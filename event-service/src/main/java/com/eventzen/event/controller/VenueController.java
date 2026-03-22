package com.eventzen.event.controller;

import com.eventzen.event.dto.VenueRequest;
import com.eventzen.event.dto.VenueResponse;
import com.eventzen.event.service.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public VenueResponse createVenue(@Valid @RequestBody VenueRequest request) {
        return venueService.createVenue(request);
    }

    @GetMapping
    public List<VenueResponse> getAllVenues() {
        return venueService.getAllVenues();
    }

    @GetMapping("/{id}")
    public VenueResponse getVenueById(@PathVariable Long id) {
        return venueService.getVenueById(id);
    }
}
