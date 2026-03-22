package com.eventzen.event.service;

import com.eventzen.event.dto.VenueRequest;
import com.eventzen.event.dto.VenueResponse;
import com.eventzen.event.mapper.VenueMapper;
import com.eventzen.event.model.Venue;
import com.eventzen.event.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;
    private final VenueMapper venueMapper;

    public VenueResponse createVenue(VenueRequest request) {
        Venue venue = Venue.builder()
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .capacity(request.getCapacity())
                .costPerDay(request.getCostPerDay())
                .build();

        return venueMapper.toResponse(venueRepository.save(venue));
    }

    public List<VenueResponse> getAllVenues() {
        return venueMapper.toResponseList(venueRepository.findAll());
    }

    public VenueResponse getVenueById(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
        return venueMapper.toResponse(venue);
    }
}
