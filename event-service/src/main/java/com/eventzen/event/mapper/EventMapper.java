package com.eventzen.event.mapper;

import com.eventzen.event.dto.EventResponse;
import com.eventzen.event.model.Event;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", uses = {VenueMapper.class, VendorMapper.class})
public interface EventMapper {

    EventMapper INSTANCE = Mappers.getMapper(EventMapper.class);

    @Mapping(target = "organizerName", ignore = true) // Will be populated by service via OpenFeign
    EventResponse toResponse(Event event);

    List<EventResponse> toResponseList(List<Event> events);
}
