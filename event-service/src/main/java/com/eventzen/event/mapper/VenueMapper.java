package com.eventzen.event.mapper;

import com.eventzen.event.dto.VenueResponse;
import com.eventzen.event.model.Venue;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VenueMapper {

    VenueMapper INSTANCE = Mappers.getMapper(VenueMapper.class);

    VenueResponse toResponse(Venue venue);

    List<VenueResponse> toResponseList(List<Venue> venues);
}
