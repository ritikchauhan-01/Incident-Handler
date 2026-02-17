package com.zeotap.assignment.controller;

import com.zeotap.assignment.repository.model.Incident;
import com.zeotap.assignment.service.IncidentService;
import com.zeotap.assignment.service.model.IncidentInput;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/incidents")
@CrossOrigin
public class IncidentController {
	
	private final IncidentService incidentService;
	
	public IncidentController (IncidentService incidentService){
		this.incidentService = incidentService;
	}
	
	@GetMapping(value = "/{id}")
	public Incident getIncidentDetails(@PathVariable String id){
		return incidentService.getIncidentDetails(id);
	}
	
	@GetMapping
	public Page<Incident> getIncidents(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			
			@RequestParam(defaultValue = "createdAt") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDirection,
			
			@RequestParam(required = false) String service,
			@RequestParam(required = false) List<String> severity,
			@RequestParam(required = false) List<String> status,
			@RequestParam(required = false) String search
	) {
		return incidentService.getIncidents(page, size, sortBy, sortDirection, service, severity, status, search);
	}
	
	
	@PostMapping
	public Incident createIncident(@RequestBody IncidentInput incidentInput){
		return incidentService.createIncident(incidentInput);
	}
	
	@PatchMapping(value = "/{id}")
	public Incident updateIncident(@PathVariable String id, @RequestBody IncidentInput incidentInput){
		return incidentService.updateIncident(id,incidentInput);
	}
}
