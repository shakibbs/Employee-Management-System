package com.bs23.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for payroll summary per department
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayRollSummaryDTO {
    private String department;
    private double totalSalary;
    private double averageSalary;
}
