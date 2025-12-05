package com.bs23.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceReport {
    private Long employeeId;
    private String employeeName;
    private int totalDays;
    private int presentDays;
    private int absentDays;
    private double totalHoursWorked;
}
