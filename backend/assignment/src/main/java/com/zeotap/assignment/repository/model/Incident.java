package com.zeotap.assignment.repository.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.sql.Timestamp;
import java.util.UUID;

@Table(name = "INCIDENT")
@Entity
public class Incident {
	
	@Id
	@UuidGenerator
	@Column(name = "ID", nullable = false,updatable = false)
	private UUID id;
	
	@Column(name = "TITLE",nullable = false)
	private String title;
	
	@Column(name = "SERVICE",nullable = false)
	@Enumerated(EnumType.STRING)
	private Service service;
	
	@Column(name = "SEVERITY",nullable = false)
	@Enumerated(EnumType.STRING)
	private Severity severity;
	
	@Column(name = "STATUS",nullable = false)
	@Enumerated(EnumType.STRING)
	private Status status;

	@CreationTimestamp
	@Column(name = "CREATED_AT",nullable = false, updatable = false)
	private Timestamp createdAt;
	
	@Column(name = "UPDATED_AT")
	@UpdateTimestamp
	private Timestamp updatedAt;
	
	@Column(name = "OWNER")
	@Email
	private String owner;
	
	@Column(name = "SUMMARY")
	private String summary;
	
	public UUID getId() {
		return id;
	}
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public Severity getSeverity() {
		return severity;
	}
	
	public void setSeverity(Severity severity) {
		this.severity = severity;
	}
	
	public Status getStatus() {
		return status;
	}
	
	public void setStatus(Status status) {
		this.status = status;
	}
	
	public Timestamp getCreatedAt() {
		return createdAt;
	}
	
	public Timestamp getUpdatedAt() {
		return updatedAt;
	}
	
	public String getOwner() {
		return owner;
	}
	
	public void setOwner(String owner) {
		this.owner = owner;
	}
	
	public String getSummary() {
		return summary;
	}
	
	public void setSummary(String summary) {
		this.summary = summary;
	}
	
	public Service getService() {
		return service;
	}
	
	public void setService(Service service) {
		this.service = service;
	}
	
}
