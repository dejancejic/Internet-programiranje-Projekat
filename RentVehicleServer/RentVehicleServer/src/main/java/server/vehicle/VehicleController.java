package server.vehicle;

import java.util.List;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import server.manufacturer.Manufacturer;
import server.vehicle.bike.Bike;
import server.vehicle.bike.BikeModel;
import server.vehicle.car.Car;
import server.vehicle.car.CarModel;
import server.vehicle.scooter.Scooter;
import server.vehicle.scooter.ScooterModel;

@RestController
@RequestMapping("/vehicle")
public class VehicleController {

	
	private final VehicleService service;
	
	
	@Autowired
	public VehicleController(VehicleService service) {
		this.service=service;
	}
	
	@GetMapping("/id")
	public ResponseEntity<Vehicle> getVehicleById(@RequestParam Integer id){
		return new ResponseEntity<Vehicle>(service.getVehicleById(id),HttpStatus.OK);
	}

	@GetMapping("/cars")
	public Page<Car> getCars(@RequestParam(defaultValue = "0") int page,
							 @RequestParam(defaultValue = "6") int size,
							 @RequestParam(defaultValue = "") String query){
		return service.getCars(PageRequest.of(page,size),query);
	}
	@GetMapping("/bikes")
	public Page<Bike> getBikes(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "6") int size,
		@RequestParam(defaultValue = "") String query){
			return service.getBikes(PageRequest.of(page,size),query);
	}
	@GetMapping("/scooters")
	public Page<Scooter> getScooters(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "6") int size,
			@RequestParam(defaultValue = "") String query){
		return service.getScooters(PageRequest.of(page,size),query);
	}
	
	@PostMapping("/cars/add")
    public ResponseEntity<Car> addCar(@RequestBody CarModel car) {

        return new ResponseEntity<>(service.addCar(car), HttpStatus.OK);
    }
	
	@PostMapping("/bikes/add")
    public ResponseEntity<Bike> addBike(@RequestBody BikeModel bike) {
		
        return new ResponseEntity<>(service.addBike(bike), HttpStatus.OK);
    }
	@PostMapping("/scooters/add")
    public ResponseEntity<Scooter> addScooter(@RequestBody ScooterModel scooter) {
		
        return new ResponseEntity<>(service.addScooter(scooter), HttpStatus.OK);
    }
	
	@PatchMapping("/car/update/price")
	public ResponseEntity<Car> updateCarRentalPrice(@RequestBody Car vehicle)
	{
		return new ResponseEntity<Car>(service.updateCarRentPrice(vehicle),HttpStatus.OK);
	}
	@PatchMapping("/bike/update/price")
	public ResponseEntity<Bike> updateBikeRentalPrice(@RequestBody Bike vehicle)
	{
		return new ResponseEntity<Bike>(service.updateBikeRentPrice(vehicle),HttpStatus.OK);
	}
	
	@PatchMapping("/scooter/update/price")
	public ResponseEntity<Scooter> updateScooterRentalPrice(@RequestBody Scooter vehicle)
	{
		return new ResponseEntity<Scooter>(service.updateScooterRentPrice(vehicle),HttpStatus.OK);
	}
	
	
	
	
	@DeleteMapping("/delete")
	public ResponseEntity<Vehicle> deleteVehicle(@RequestParam Integer id)
	{
		return new ResponseEntity<Vehicle>(service.deleteVehicle(id),HttpStatus.OK);
	}
	
	
}
