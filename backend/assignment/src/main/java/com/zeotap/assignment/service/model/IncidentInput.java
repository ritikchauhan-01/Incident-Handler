package com.zeotap.assignment.service.model;

import com.zeotap.assignment.repository.model.Service;
import com.zeotap.assignment.repository.model.Severity;
import com.zeotap.assignment.repository.model.Status;
import jakarta.validation.constraints.Email;

public record IncidentInput(String title , Service service, Severity severity, Status status, @Email String owner, String summary){
}
