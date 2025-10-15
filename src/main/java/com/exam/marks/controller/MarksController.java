package com.exam.marks.controller;

import com.exam.marks.dto.MarksResponse;
import com.exam.marks.model.Marks;
import com.exam.marks.model.Student;
import com.exam.marks.service.MarksService;
import com.exam.marks.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin
public class MarksController {

    private Float convertToFloat(Object value) {
        if (value == null)
            return null;
        if (value instanceof Number) {
            return ((Number) value).floatValue();
        }
        try {
            return Float.parseFloat(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    @Autowired
    private MarksService marksService;

    @Autowired
    private StudentService studentService;

    @PostMapping("/add")
    public ResponseEntity<?> addMarks(@RequestParam String studentId, @RequestBody Map<String, Object> marksData) {
        try {
            Student student = studentService.findById(studentId);
            if (student == null) {
                return ResponseEntity.badRequest().body("Student not found");
            }

            // Check if student already has marks
            Marks existingMarks = marksService.findByStudentId(studentId);
            if (existingMarks != null) {
                return ResponseEntity.badRequest().body("Marks already exist for this student. Use update endpoint.");
            }

            // Validate if marks data is provided
            if (!marksData.containsKey("tr1") && !marksData.containsKey("tr2") && !marksData.containsKey("tr3")) {
                return ResponseEntity.badRequest().body("No marks data provided");
            }

            Marks marks = new Marks();
            marks.setStudent(student);

            // Convert and set marks, handling potential number format issues
            Float tr1 = convertToFloat(marksData.get("tr1"));
            Float tr2 = convertToFloat(marksData.get("tr2"));
            Float tr3 = convertToFloat(marksData.get("tr3"));

            if (tr1 != null) {
                marks.setTr1(tr1);
            }
            if (tr2 != null) {
                marks.setTr2(tr2);
            }
            if (tr3 != null) {
                marks.setTr3(tr3);
            }

            marks.calculateTotal();
            Marks savedMarks = marksService.saveMarks(marks);
            marksService.updateAllRanks();
            return ResponseEntity.ok(MarksResponse.fromMarks(savedMarks));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing marks: " + e.getMessage());
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentMarks(@PathVariable String studentId) {
        Marks marks = marksService.findByStudentId(studentId);
        if (marks == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(MarksResponse.fromMarks(marks));
    }

    @PutMapping("/update/{studentId}")
    public ResponseEntity<?> updateMarks(@PathVariable String studentId, @RequestBody Map<String, Object> marksData) {
        try {
            Marks existingMarks = marksService.findByStudentId(studentId);
            if (existingMarks == null) {
                return ResponseEntity.notFound().build();
            }

            // Validate if marks data is provided
            if (!marksData.containsKey("tr1") && !marksData.containsKey("tr2") && !marksData.containsKey("tr3")) {
                return ResponseEntity.badRequest().body("No marks data provided");
            }

            if (marksData.containsKey("tr1")) {
                Float tr1 = convertToFloat(marksData.get("tr1"));
                if (tr1 != null) {
                    existingMarks.setTr1(tr1);
                }
            }
            if (marksData.containsKey("tr2")) {
                Float tr2 = convertToFloat(marksData.get("tr2"));
                if (tr2 != null) {
                    existingMarks.setTr2(tr2);
                }
            }
            if (marksData.containsKey("tr3")) {
                Float tr3 = convertToFloat(marksData.get("tr3"));
                if (tr3 != null) {
                    existingMarks.setTr3(tr3);
                }
            }
            existingMarks.calculateTotal();
            Marks savedMarks = marksService.saveMarks(existingMarks);
            marksService.updateAllRanks();
            return ResponseEntity.ok(MarksResponse.fromMarks(savedMarks));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing marks: " + e.getMessage());
        }
    }

    @GetMapping("/rank")
    public List<MarksResponse> getAllMarksWithRank() {
        return marksService.getAllMarksWithRank().stream()
                .map(MarksResponse::fromMarks)
                .toList();
    }
}