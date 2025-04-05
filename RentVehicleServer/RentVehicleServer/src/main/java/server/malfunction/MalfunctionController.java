package server.malfunction;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/malfunction")
public class MalfunctionController {

	@Autowired
	private MalfunctionService service;
	
	
	@GetMapping("/id")
	public ResponseEntity<List<Malfunction>> getVehicleMalfunctions(@RequestParam Integer id){
		return new ResponseEntity<List<Malfunction>>(service.getVehicleMalfunctions(id),HttpStatus.OK);
	}
	
	@PostMapping("/add")
	public ResponseEntity<Malfunction> addMalfunction(@RequestBody Malfunction malfunction)
	{
		return new ResponseEntity<Malfunction>(service.addMalfunction(malfunction),HttpStatus.OK);
	}
	
	@PutMapping("/solve")
	public ResponseEntity<Malfunction> solveMalfunction(@RequestParam Integer id){
		return new ResponseEntity<Malfunction>(service.solveMalfunction(id),HttpStatus.OK);
	}
	

}
