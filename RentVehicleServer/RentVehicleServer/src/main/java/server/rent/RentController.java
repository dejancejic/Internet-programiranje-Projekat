package server.rent;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/rent")
public class RentController {


	@Autowired
	private RentService service;
	
	@GetMapping("/id")
	public ResponseEntity<List<Rent>> getVehicleRents(@RequestParam Integer id){
		return new ResponseEntity<List<Rent>>(service.getVehicleRents(id),HttpStatus.OK);
	}

}
