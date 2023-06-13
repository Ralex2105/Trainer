package ru.ralex2105.trainer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TrainerApplication {

	public static String serverLink = "http://localhost:3000/";

	public static void main(String[] args) {
		SpringApplication.run(TrainerApplication.class, args);
	}

}
