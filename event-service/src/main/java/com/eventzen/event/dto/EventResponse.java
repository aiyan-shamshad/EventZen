package com.eventzen.event.dto;

import com.eventzen.event.model.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private VenueResponse venue;
    private Long organizerId;
    private String organizerName; // Fetched via OpenFeign
    private EventStatus status;
    private Integer maxAttendees;
    private Set<VendorResponse> vendors;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
