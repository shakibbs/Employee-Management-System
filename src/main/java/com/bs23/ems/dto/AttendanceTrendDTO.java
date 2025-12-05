package com.bs23.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for attendance trends by date
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceTrendDTO {
    private String date;       // formatted as yyyy-MM-dd
    private Long totalCheckIns;
}
