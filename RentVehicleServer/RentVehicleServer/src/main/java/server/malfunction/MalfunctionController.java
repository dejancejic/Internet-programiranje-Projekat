package server.malfunction;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/malfunction")
public class MalfunctionController {

	@Autowired
	private MalfunctionService service;
	
	
	@GetMapping("/id")
	public Page<Malfunction> getVehicleMalfunctions(@RequestParam Integer id,
													@RequestParam(defaultValue = "0") int page,
													@RequestParam(defaultValue = "6") int size,
													@RequestParam(defaultValue = "") String query){
		return service.getVehicleMalfunctions(id,page,size,query);
	}
	
	@PostMapping("/add")
	public ResponseEntity<Malfunction> addMalfunction(@RequestBody Malfunction malfunction)
	{
		return new ResponseEntity<Malfunction>(service.addMalfunction(malfunction),HttpStatus.OK);
	}
	
	@PutMapping("/solve")
	public ResponseEntity<Boolean> solveMalfunction(@RequestParam Integer id){
		return new ResponseEntity<Boolean>(service.solveMalfunction(id),HttpStatus.OK);
	}
	

}
