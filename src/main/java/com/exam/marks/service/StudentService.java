package com.exam.marks.service;

import com.exam.marks.model.Student;
import com.exam.marks.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    public Student register(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student findByEmail(String email) {
        return studentRepository.findByEmail(email).orElse(null);
    }

    public boolean existsByEmail(String email) {
        return studentRepository.existsByEmail(email);
    }

    public Student findById(String id) {
        return studentRepository.findById(id).orElse(null);
    }
}
