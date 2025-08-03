package com.oahelp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * OA帮助系统应用程序入口
 */
@SpringBootApplication
@EnableScheduling
public class OaHelpApplication {

    public static void main(String[] args) {
        SpringApplication.run(OaHelpApplication.class, args);
    }
}