package server.malfunction;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


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
	
	@DeleteMapping("/delete")
	public ResponseEntity<Malfunction> deleteMalfunction(@RequestParam Integer id){
		return new ResponseEntity<Malfunction>(service.removeMalfunction(id),HttpStatus.OK);
	}
	

}
