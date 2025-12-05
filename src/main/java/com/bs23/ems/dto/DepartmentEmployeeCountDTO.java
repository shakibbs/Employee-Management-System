package com.bs23.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for employee count per department
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentEmployeeCountDTO {
    private String department;
    private Long employeeCount;
}
