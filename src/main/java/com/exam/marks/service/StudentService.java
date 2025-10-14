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

//    @Autowired
//    private PasswordEncoder passwordEncoder;

    public Student register(Student s){
       return studentRepository.save(s);
    }
    public List<Student> getAllStudents(){
        return studentRepository.findAll();
    }

}
