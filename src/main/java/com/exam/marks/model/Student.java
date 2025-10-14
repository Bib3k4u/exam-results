package com.exam.marks.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("students")
public class Student {
    @Id
    private String id;
    private String name;
    private String email;
    private  String password;

    public Student(){}
    public Student(String name, String email, String password){
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name = name;
    }

    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email = email;
    }

    public String getPassword(){
        return password;
    }
    public void setPassword(String password){
        this.password = password;
    }
}
