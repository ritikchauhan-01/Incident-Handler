package com.zeotap.assignment;

import com.zeotap.assignment.repository.IncidentRepository;
import com.zeotap.assignment.repository.model.Incident;
import com.zeotap.assignment.repository.model.Severity;
import com.zeotap.assignment.repository.model.Status;
import com.zeotap.assignment.service.SeedDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@SpringBootApplication
@EnableAsync
public class AssignmentApplication {


	public static void main(String[] args) {

		ApplicationContext context =
				SpringApplication.run(AssignmentApplication.class, args);

		SeedDataService seedDataService =
				context.getBean(SeedDataService.class);

		seedDataService.addRandomDataToTable();

	}

}
