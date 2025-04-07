package server.manufacturer;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/manufacturer")
public class ManufacturerController {

	private final ManufacturerService service;
	
	@Autowired
	public ManufacturerController(ManufacturerService service)
	{
		this.service=service;
	}
	
	
	@PostMapping("/add")
	public ResponseEntity<Manufacturer> addManufacturer(@RequestBody Manufacturer manufacturer,@RequestParam String type)
	{
		return new ResponseEntity<Manufacturer>(service.addManufacturer(manufacturer, type),HttpStatus.OK);
	}
	
	
	@PutMapping("/update")
	public ResponseEntity<Manufacturer> updateManufacturer(@RequestBody Manufacturer manufacturer)
	{
		return new ResponseEntity<Manufacturer>(service.updateManufacturer(manufacturer),HttpStatus.OK);
	}
	
	
	
//	@GetMapping("/all")
//	public ResponseEntity<HashMap<String,ArrayList<Manufacturer>>> getAllManufacturers()
//	{
//		return new ResponseEntity<HashMap<String,ArrayList<Manufacturer>>>(service.getAllManufacturers(),HttpStatus.OK);
//	}

	@GetMapping("/all")
	public HashMap<String, Page<Manufacturer>> getAllManufacturers(@RequestParam(defaultValue = "0") int page,
																   @RequestParam(defaultValue = "6") int size,
																   @RequestParam(defaultValue = "") String query)
	{
		return service.getAllManufacturers(PageRequest.of(page, size), query);
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<Manufacturer> deleteManufacturer(@RequestParam Integer id)
	{
		return new ResponseEntity<Manufacturer>(service.deleteManufacturer(id),HttpStatus.OK);
	}
	
	
	

}
