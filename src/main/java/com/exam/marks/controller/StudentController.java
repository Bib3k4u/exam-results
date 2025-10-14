package com.exam.marks.controller;

import com.exam.marks.model.Student;
import com.exam.marks.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {
    @Autowired
    StudentService studentService;
    @PostMapping("/add")
    public Student registerStudent(@RequestBody Student s){
        String hashedPassword = s.getPassword()+"@@@";
        s.setPassword(hashedPassword);
         return studentService.register(s);
    }

    @GetMapping
    public List<Student> getAllStudents(){
        return studentService.getAllStudents();
    }
}
