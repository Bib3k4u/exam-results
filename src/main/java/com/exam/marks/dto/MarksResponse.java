package com.exam.marks.dto;

import com.exam.marks.model.Marks;

public class MarksResponse {
    private String id;
    private StudentResponse student;
    private Float tr1;
    private Float tr2;
    private Float tr3;
    private Float total;
    private Boolean selected;
    private Integer rank;

    public static MarksResponse fromMarks(Marks marks) {
        MarksResponse response = new MarksResponse();
        response.setId(marks.getId());
        response.setStudent(StudentResponse.fromStudent(marks.getStudent()));
        response.setTr1(marks.getTr1());
        response.setTr2(marks.getTr2());
        response.setTr3(marks.getTr3());
        response.setTotal(marks.getTotal());
        response.setSelected(marks.getSelected());
        response.setRank(marks.getRank());
        return response;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public StudentResponse getStudent() {
        return student;
    }

    public void setStudent(StudentResponse student) {
        this.student = student;
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