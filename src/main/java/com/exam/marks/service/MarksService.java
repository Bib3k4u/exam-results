package com.exam.marks.service;

import com.exam.marks.model.Marks;
import com.exam.marks.repository.MarksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarksService {
    @Autowired
    private MarksRepository marksRepository;
    public Marks saveMarks(Marks m){
        m.calculateTotal();
        return marksRepository.save(m);
    }
    public Marks getMarksByStudentId(String studentId){
//        return marksRepository.findStudentId(studentId).orElse(null);
        return null;
    }

    public void computeRanks(){
//        List<Marks> allMarks = marksRepository.findAllMarks();
//        Marks marks;
//        int rank = 1;
//        Float prevTotal = null;
//        for(int i = 0; i < allMarks.size(); i++){
//            if(prevTotal != null && prevTotal.equals(m.getTotal())){
//                m.setRank((rank));
//            }
//            else{
//                rank = i+1;
//                m.setRank(rank);
//            }
//            prevTotal = m.getTotal();
//        }
    }
}
