package com.exam.marks.controller;

import com.exam.marks.dto.StudentResponse;
import com.exam.marks.model.Student;
import com.exam.marks.security.CustomPasswordEncoder;
import com.exam.marks.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@CrossOrigin
public class StudentController {
    @Autowired
    private StudentService studentService;

    @Autowired
    private CustomPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@RequestBody Student student) {
        if (studentService.findByEmail(student.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        String encodedPassword = passwordEncoder.encode(student.getPassword());
        student.setPassword(encodedPassword);
        Student registeredStudent = studentService.register(student);
        return ResponseEntity.ok(StudentResponse.fromStudent(registeredStudent));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Student student = studentService.findByEmail(email);
        if (student == null) {
            return ResponseEntity.badRequest().body("Invalid email");
        }

        if (!passwordEncoder.matches(password, student.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }

        return ResponseEntity.ok(StudentResponse.fromStudent(student));
    }

    @GetMapping
    public List<StudentResponse> getAllStudents() {
        return studentService.getAllStudents().stream()
                .map(StudentResponse::fromStudent)
                .toList();
    }
}