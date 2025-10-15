package com.exam.marks.security;

import org.springframework.stereotype.Component;
import java.security.MessageDigest;
import java.util.Base64;

@Component
public class CustomPasswordEncoder {
    private static final String SALT = "examResults";
    public String encode(String rawPassword) {

        try {
           MessageDigest digest = MessageDigest.getInstance("SHA-256");
           String saltedPassword = SALT + rawPassword + SALT;
           byte[] hash = digest.digest(saltedPassword.getBytes("UTF-8"));
           return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Not able to encode Password", e);
        }
    }

    public boolean matches(String rawPassword, String encodedPassword){
        String newEncodedPassword = encode(rawPassword);
        return newEncodedPassword.equals(encodedPassword);
    }


}
