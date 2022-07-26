package com.hlbank.processing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.hlbank.processing")
@EnableJpaRepositories(basePackages={"com.hlbank.processing"})
public class HlbankApplication {

	public static void main(String[] args) {
		SpringApplication.run(HlbankApplication.class, args);
	}

}
