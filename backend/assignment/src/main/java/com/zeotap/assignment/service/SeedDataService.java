package com.zeotap.assignment.service;

import com.zeotap.assignment.repository.IncidentRepository;
import com.zeotap.assignment.repository.model.Incident;
import com.zeotap.assignment.repository.model.Severity;
import com.zeotap.assignment.repository.model.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class SeedDataService {
	@Autowired
	IncidentRepository incidentRepository;
//	public SeedDataService(IncidentRepository incidentRepository){
//		this.incidentRepository = incidentRepository;
//	}

	
	@Async
	public void addRandomDataToTable(){
		Severity[] severity = Severity.values();
		Status[] status = Status.values();
		com.zeotap.assignment.repository.model.Service[] service = com.zeotap.assignment.repository.model.Service.values();
		for(int i = 0; i < 200;i++){
			Incident incident = new Incident();
			incident.setSeverity(severity[new Random().nextInt(severity.length)]);
			incident.setTitle("Incident - " + i);
			incident.setStatus(status[new Random().nextInt(status.length)]);
			incident.setService(service[new Random().nextInt(service.length)]);
			incidentRepository.save(incident);
		}
		
	}
}
