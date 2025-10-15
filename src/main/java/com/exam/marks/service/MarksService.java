package com.exam.marks.service;

import com.exam.marks.model.Marks;
import com.exam.marks.repository.MarksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class MarksService {
    @Autowired
    private MarksRepository marksRepository;

    public Marks saveMarks(Marks marks) {
        marks.calculateTotal();
        return marksRepository.save(marks);
    }

    public Marks findByStudentId(String studentId) {
        return marksRepository.findByStudentId(studentId).orElse(null);
    }

    public void updateAllRanks() {
        List<Marks> allMarks = marksRepository.findAll();
        if (allMarks.isEmpty()) {
            return;
        }

        allMarks.sort((m1, m2) -> {
            Float total1 = m1.getTotal() != null ? m1.getTotal() : 0f;
            Float total2 = m2.getTotal() != null ? m2.getTotal() : 0f;
            return total2.compareTo(total1); 
        });

        int rank = 1;
        Float lastTotal = allMarks.get(0).getTotal();
        allMarks.get(0).setRank(rank);
        marksRepository.save(allMarks.get(0));

        for (int i = 1; i < allMarks.size(); i++) {
            Marks currentMarks = allMarks.get(i);
            Float currentTotal = currentMarks.getTotal() != null ? currentMarks.getTotal() : 0f;

            if (!currentTotal.equals(lastTotal)) {
                rank = i + 1; 
            }

            currentMarks.setRank(rank);
            marksRepository.save(currentMarks);
            lastTotal = currentTotal;
        }
    }

    public List<Marks> getAllMarksWithRank() {
        List<Marks> allMarks = marksRepository.findAll();
        allMarks.sort((m1, m2) -> {
            Float total1 = m1.getTotal() != null ? m1.getTotal() : 0f;
            Float total2 = m2.getTotal() != null ? m2.getTotal() : 0f;
            return total2.compareTo(total1); 
        });
        return allMarks;
    }
}
