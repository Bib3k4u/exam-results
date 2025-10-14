package com.exam.marks.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("marks")
public class Marks {
    @Id
    private String id;
    @DBRef
    private Student student;
    private Float TR1;
    private Float TR2;
    private Float TR3;
    private Float Total;
    private Boolean selected;
    private Integer rank;

    public void calculateTotal(){
        float t = (TR1 == null ? 0 : TR1)
                + (TR2 == null ? 0 : TR2)
                +(TR3 == null ? 0 : TR3);
        this.Total = t;
        double avg = t/3.0;
        this.selected = avg > 35.0;
    }
    public String getId(){
        return id;
    }
    public Student getStudent(){return student;}
    public void setStudent(Student student){this.student = student;}
    public void setId(String id){
        this.id = id;
    }
    public Float getTR1() {return TR1;}
    public void setTR1(Float TR1){this.TR1 = TR1;}

    public Float getTR2() {return TR2;}
    public void setTR2(Float TR2){this.TR2 = TR2;}

    public Float getTR3() {return TR3;}
    public void setTR3(Float TR3){this.TR3 = TR3;}

    public Float getTotal(){return Total;}
    public void setTotal(Float Total){ this.Total = Total;}

    public Boolean getSelected(){return selected;}
    public void setSelected(Boolean selected){ this.selected = selected;}

    public Integer getRank(){return rank;}
    public void setRank(Integer rank){this.rank = rank;}


}
