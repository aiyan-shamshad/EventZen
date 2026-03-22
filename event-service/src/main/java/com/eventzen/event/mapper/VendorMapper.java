package com.eventzen.event.mapper;

import com.eventzen.event.dto.VendorResponse;
import com.eventzen.event.model.Vendor;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VendorMapper {

    VendorMapper INSTANCE = Mappers.getMapper(VendorMapper.class);

    VendorResponse toResponse(Vendor vendor);

    List<VendorResponse> toResponseList(List<Vendor> vendors);
}
