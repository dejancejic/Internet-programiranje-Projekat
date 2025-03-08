package server.vehicle;

import java.util.List;
import java.util.Base64;

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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import server.manufacturer.Manufacturer;
import server.vehicle.car.Car;
import server.vehicle.car.CarModel;

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
	
	@PostMapping("/cars/add")
    public ResponseEntity<Car> addCar(@RequestBody CarModel car) {
		int indexOf=car.getImage().indexOf("base64,");
		
		String image=car.getImage().substring(indexOf+7);
		
		Car c=new Car();
		
		c.setImage(Base64.getDecoder().decode(image));
		
		c.setId(null);
		c.setCarId(car.getCarId());
		c.setDescription(car.getDescription());
		c.setManufacturerId(car.getManufacturerId());
		c.setModel(car.getModel());
		c.setPrice(car.getPrice());
		
		
        return new ResponseEntity<>(service.addCar(c), HttpStatus.OK);
    }
	
	@DeleteMapping("/delete")
	public ResponseEntity<Vehicle> deleteVehicle(@RequestParam Integer id)
	{
		return new ResponseEntity<Vehicle>(service.deleteVehicle(id),HttpStatus.OK);
	}
	
	
}
