package com.exam.marks.dto;

import com.exam.marks.model.Marks;
import com.exam.marks.model.Student;

public class DashboardStudentResponse {
    private String studentId;
    private String name;
    private String email;
    private Float tr1;
    private Float tr2;
    private Float tr3;
    private Float total;
    private Boolean selected;
    private Integer rank;

    public DashboardStudentResponse() {
    }

    public DashboardStudentResponse(String studentId, String name, String email, Float tr1, Float tr2, Float tr3,
            Float total, Boolean selected, Integer rank) {
        this.studentId = studentId;
        this.name = name;
        this.email = email;
        this.tr1 = tr1;
        this.tr2 = tr2;
        this.tr3 = tr3;
        this.total = total;
        this.selected = selected;
        this.rank = rank;
    }

    public static DashboardStudentResponse fromMarksAndStudent(Marks marks, Student student) {
        return new DashboardStudentResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                marks.getTr1(),
                marks.getTr2(),
                marks.getTr3(),
                marks.getTotal(),
                marks.getSelected(),
                marks.getRank());
    }

    // Getters and Setters
    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Float getTr1() {
        return tr1;
    }

    public void setTr1(Float tr1) {
        this.tr1 = tr1;
    }

    public Float getTr2() {
        return tr2;
    }

    public void setTr2(Float tr2) {
        this.tr2 = tr2;
    }

    public Float getTr3() {
        return tr3;
    }

    public void setTr3(Float tr3) {
        this.tr3 = tr3;
    }

    public Float getTotal() {
        return total;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

    public Boolean getSelected() {
        return selected;
    }

    public void setSelected(Boolean selected) {
        this.selected = selected;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }
}
