package com.zeotap.assignment.controller;

import com.zeotap.assignment.service.SeedDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SeedDataController {
	
	@Autowired
	private SeedDataService  seedDataService;
	
	@GetMapping(path = "/seedData")
	public String seedRandomData(){
		seedDataService.addRandomDataToTable();
		return "Seeding started";
	}
}
