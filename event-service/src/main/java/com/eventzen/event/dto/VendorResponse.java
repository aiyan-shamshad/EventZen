package com.eventzen.event.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorResponse {
    private Long id;
    private String name;
    private String serviceType;
    private String contactEmail;
    private String contactPhone;
    private BigDecimal cost;
}
