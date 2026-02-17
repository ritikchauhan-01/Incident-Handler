package com.zeotap.assignment.service;

import com.zeotap.assignment.exception.IncidentException;
import com.zeotap.assignment.repository.IncidentRepository;
import com.zeotap.assignment.repository.model.Incident;
import com.zeotap.assignment.repository.model.Severity;
import com.zeotap.assignment.repository.model.Status;
import com.zeotap.assignment.service.model.IncidentInput;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
public class IncidentService {
	
	private final IncidentRepository incidentRepository;
	
	public IncidentService(IncidentRepository incidentRepository){
		this.incidentRepository = incidentRepository;
	}
	
	public Incident createIncident(IncidentInput incidentInput) {
		if(!StringUtils.hasText(incidentInput.title())){
			throw new IncidentException("Title should not be null",400);
		}
		Incident incident = new Incident();
		incident.setSeverity(incidentInput.severity());
		incident.setStatus(incidentInput.status());
		incident.setTitle(incidentInput.title());
		incident.setService(incidentInput.service());
		if(StringUtils.hasText(incidentInput.owner()))
			incident.setOwner(incidentInput.owner());
		if(StringUtils.hasText(incidentInput.summary()))
			incident.setSummary(incidentInput.summary());
		return incidentRepository.save(incident);
	}
	
	public Incident updateIncident(String id, IncidentInput incidentInput) {
		UUID incidentId = validateIncidentId(id);
		Incident incident = incidentRepository.findById(incidentId).orElseThrow(() -> new IncidentException("Incident not found",404));
		if(incidentInput.status() !=null )
			incident.setStatus(incidentInput.status());
		if(incidentInput.service() != null)
			incident.setService(incidentInput.service());
		if(incidentInput.severity() != null)
			incident.setSeverity(incidentInput.severity());
		if(StringUtils.hasText(incidentInput.summary()))
			incident.setSummary(incidentInput.summary());
		if(StringUtils.hasText(incidentInput.owner()))
			incident.setOwner(incidentInput.owner());
		if(StringUtils.hasText(incidentInput.title()))
			incident.setTitle(incident.getTitle());
		return incidentRepository.save(incident);
	}
	
	public Incident getIncidentDetails(String id) {
		UUID incidentId = validateIncidentId(id);
		return incidentRepository.findById(incidentId).orElseThrow(() -> new IncidentException("Incident not found",404));
	}
	
	private UUID validateIncidentId(String id){
		try{
			return UUID.fromString(id);
		} catch (Exception e) {
			throw new IncidentException("Invalid Id", 400);
		}
	}
	
	public Page<Incident> getIncidents(
			int page,
			int size,
			String sortBy,
			String sortDirection,
			String service,
			List<String> severity,
			List<String> status,
			String search) {
		
		Sort.Direction direction = Sort.Direction.fromOptionalString(sortDirection)
				.orElseThrow(() -> new IncidentException("Invalid sort direction. Use 'asc' or 'desc'", 400));
		
		PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sortBy));
		
		Specification<Incident> spec = Specification.where(null);
		
		/* SERVICE FILTER */
		if (service != null && !service.isBlank()) {
			spec = spec.and((root, query, cb) ->
					cb.equal(root.get("service"), com.zeotap.assignment.repository.model.Service.valueOf(service)));
		}
		
		/* SEVERITY MULTI FILTER */
		if (severity != null && !severity.isEmpty()) {
			spec = spec.and((root, query, cb) ->
					root.get("severity").in(severity.stream()
							.map(Severity::valueOf)
							.toList()));
		}
		
		/* STATUS MULTI FILTER */
		if (status != null && !status.isEmpty()) {
			spec = spec.and((root, query, cb) ->
					root.get("status").in(status.stream()
							.map(Status::valueOf)
							.toList()));
		}
		
		/* SEARCH BY TITLE */
		if (search != null && !search.isBlank()) {
			spec = spec.and((root, query, cb) ->
					cb.like(cb.lower(root.get("title")), "%" + search.toLowerCase() + "%"));
		}
		
		return incidentRepository.findAll(spec, pageRequest);
	}
	
}
