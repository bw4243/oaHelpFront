package com.oahelp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OaHelpBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(OaHelpBackendApplication.class, args);
    }
}