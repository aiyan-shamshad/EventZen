package com.eventzen.event.service;

import com.eventzen.event.dto.VendorRequest;
import com.eventzen.event.dto.VendorResponse;
import com.eventzen.event.mapper.VendorMapper;
import com.eventzen.event.model.Vendor;
import com.eventzen.event.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;
    private final VendorMapper vendorMapper;

    public VendorResponse createVendor(VendorRequest request) {
        Vendor vendor = Vendor.builder()
                .name(request.getName())
                .serviceType(request.getServiceType())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .cost(request.getCost())
                .build();

        return vendorMapper.toResponse(vendorRepository.save(vendor));
    }

    public List<VendorResponse> getAllVendors() {
        return vendorMapper.toResponseList(vendorRepository.findAll());
    }

    public VendorResponse getVendorById(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found: " + id));
        return vendorMapper.toResponse(vendor);
    }
}
