package com.eventzen.event.controller;

import com.eventzen.event.dto.VendorRequest;
import com.eventzen.event.dto.VendorResponse;
import com.eventzen.event.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public VendorResponse createVendor(@Valid @RequestBody VendorRequest request) {
        return vendorService.createVendor(request);
    }

    @GetMapping
    public List<VendorResponse> getAllVendors() {
        return vendorService.getAllVendors();
    }

    @GetMapping("/{id}")
    public VendorResponse getVendorById(@PathVariable Long id) {
        return vendorService.getVendorById(id);
    }
}
