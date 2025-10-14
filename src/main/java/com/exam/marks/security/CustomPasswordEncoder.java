package com.exam.marks.security;

import org.springframework.stereotype.Component;

import java.security.MessageDigest;

@Component
public class CustomPasswordEncoder {
    @Override
    public String encode(CharSequence rawPassword){
        try{
            MessageDigest digest = MessageDigest.getInstance()
        }catch(){

        }
    }
}
