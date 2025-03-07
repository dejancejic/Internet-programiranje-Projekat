package server.vehicle;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import server.car.Car;
import server.manufacturer.Manufacturer;

@RestController
@RequestMapping("/vehicle")
public class VehicleController {

	
	private final VehicleService service;
	
	
	@Autowired
	public VehicleController(VehicleService service) {
		this.service=service;
	}

	@GetMapping("/cars")
	public ResponseEntity<List<Car>> getCars(){
		return new ResponseEntity<List<Car>>(service.getCars(),HttpStatus.OK);
	}
	
	@PostMapping("/car/add")
	public ResponseEntity<Car> addCar(@RequestBody Car car)
	{
		return new ResponseEntity<Car>(service.addCar(car),HttpStatus.OK);
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<Car> deleteCar(@RequestParam Integer id)
	{
		return new ResponseEntity<Car>(service.deleteCar(id),HttpStatus.OK);
	}
	
	
}
