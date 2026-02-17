package com.zeotap.assignment.exception;

import org.springframework.http.HttpStatus;

public class IncidentException extends RuntimeException {
	private final HttpStatus status;

	public IncidentException(String message, int errorCode){
		super(message);
		this.status = HttpStatus.valueOf(errorCode);
	}

	public HttpStatus getStatus() {
		return status;
	}
}
