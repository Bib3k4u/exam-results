package com.exam.marks.repository;

import com.exam.marks.model.Marks;
import com.exam.marks.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MarksRepository extends MongoRepository<Marks, String> {
    Optional<Marks> findByStudent(Student student);

    @Query("{ 'student._id' : ?0 }")
    Optional<Marks> findByStudentId(String studentId);

    List<Marks> findAllByOrderByTotalDesc();
}
