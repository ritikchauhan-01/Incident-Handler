package com.zeotap.assignment.repository;

import com.zeotap.assignment.repository.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, UUID>,
		JpaSpecificationExecutor<Incident> {
}
