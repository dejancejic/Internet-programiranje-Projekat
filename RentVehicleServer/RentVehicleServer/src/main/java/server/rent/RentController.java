package server.rent;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
	public Page<Rent> getVehicleRents(@RequestParam Integer id,
									  @RequestParam(defaultValue = "0") int page,
									  @RequestParam(defaultValue = "6") int size,
									  @RequestParam(defaultValue = "") String query){
		return service.getVehicleRents(id,PageRequest.of(page, size),query);
	}
	
//	@GetMapping("/all")
//	public ResponseEntity<HashMap<String,List<Rent>>> getAllRents(){
//		return new ResponseEntity<HashMap<String,List<Rent>>>(service.getAllRents(),HttpStatus.OK);
//	}

	@GetMapping("/all")
	public Map<String,Page<Rent>> getAllRents(@RequestParam(defaultValue = "0") int page,
											  @RequestParam(defaultValue = "6") int size,
											  @RequestParam(defaultValue = "") String query){
		return service.getAllRents(PageRequest.of(page, size),query);
	}

	@GetMapping("/map")
	public ResponseEntity<HashMap<String, List<RentMapModel>>> getMapModels()
	{
		return new ResponseEntity<HashMap<String,List<RentMapModel>>>(service.getMapModels(),HttpStatus.OK);
	}

}
