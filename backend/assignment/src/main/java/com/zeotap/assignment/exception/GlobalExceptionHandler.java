package com.zeotap.assignment.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(IncidentException.class)
	public ResponseEntity<Map<String, Object>> handleIncidentException(
			IncidentException ex,
			HttpServletRequest request) {
		return buildErrorResponse(ex.getStatus(), ex.getMessage(), request.getRequestURI());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleValidationException(
			MethodArgumentNotValidException ex,
			HttpServletRequest request) {
		String message = "Validation failed";
		FieldError fieldError = ex.getBindingResult().getFieldError();
		if (fieldError != null) {
			message = fieldError.getField() + ": " + fieldError.getDefaultMessage();
		}
		return buildErrorResponse(HttpStatus.BAD_REQUEST, message, request.getRequestURI());
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> handleUnexpectedException(
			Exception ex,
			HttpServletRequest request) {
		return buildErrorResponse(
				HttpStatus.INTERNAL_SERVER_ERROR,
				"Unexpected error occurred",
				request.getRequestURI());
	}

	private ResponseEntity<Map<String, Object>> buildErrorResponse(
			HttpStatus status,
			String message,
			String path) {
		Map<String, Object> body = new HashMap<>();
		body.put("timestamp", Instant.now().toString());
		body.put("status", status.value());
		body.put("error", status.getReasonPhrase());
		body.put("message", message);
		body.put("path", path);
		return ResponseEntity.status(status).body(body);
	}
}
