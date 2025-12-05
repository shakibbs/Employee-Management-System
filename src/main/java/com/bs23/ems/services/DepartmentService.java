package com.bs23.ems.services;

import com.bs23.ems.model.Department;
import com.bs23.ems.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public Department createDepartment(Department department) {
        if (department == null) {
            throw new IllegalArgumentException("Department cannot be null");
        }
        if (department.getName() == null || department.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Department name cannot be null or empty");
        }
        if (departmentRepository.existsByName(department.getName().trim())) {
            throw new IllegalArgumentException("Department with name '" + department.getName() + "' already exists");
        }
        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Optional<Department> getDepartmentById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Department ID cannot be null");
        }
        return departmentRepository.findById(id);
    }

    public Department updateDepartment(Long id, Department updatedDepartment) {
        if (id == null) {
            throw new IllegalArgumentException("Department ID cannot be null");
        }
        if (updatedDepartment == null) {
            throw new IllegalArgumentException("Updated department cannot be null");
        }
        if (updatedDepartment.getName() == null || updatedDepartment.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Department name cannot be null or empty");
        }
        return departmentRepository.findById(id)
                .map(dept -> {
                    // Check if name is being changed and if new name already exists
                    if (!dept.getName().equals(updatedDepartment.getName().trim()) &&
                        departmentRepository.existsByNameAndIdNot(updatedDepartment.getName().trim(), id)) {
                        throw new IllegalArgumentException("Department with name '" + updatedDepartment.getName() + "' already exists");
                    }
                    dept.setName(updatedDepartment.getName().trim());
                    dept.setDescription(updatedDepartment.getDescription());
                    return departmentRepository.save(dept);
                }).orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
    }

    public void deleteDepartment(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Department ID cannot be null");
        }
        
        // Check if department has assigned employees
        long employeeCount = departmentRepository.countEmployeesByDepartmentId(id);
        if (employeeCount > 0) {
            throw new IllegalArgumentException("Can't Delete when Employee is assigned");
        }
        
        departmentRepository.deleteById(id);
    }
}
