package server.account;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import server.client.Client;
import server.employee.Employee;

@RestController
@RequestMapping("/account")
public class AccountController {

	@Autowired
	private AccountService service;
	
	
	@GetMapping("/clients")
	public ResponseEntity<List<Client>> getClients()
	{
		return new ResponseEntity<List<Client>>(service.getClients(),HttpStatus.OK);
	}
	
	@GetMapping("/employees")
	public ResponseEntity<List<Employee>> getEmployees()
	{
		return new ResponseEntity<List<Employee>>(service.getEmployees(),HttpStatus.OK);
	}
	
	@PutMapping("/client/status")
	public ResponseEntity<Client> setClientStatus(@RequestParam Integer id,@RequestParam Boolean status)
	{
		return new ResponseEntity<Client>(service.setStatus(id, status),HttpStatus.OK);
	}
	
	@PostMapping("employee/add")
	public ResponseEntity<Employee> addEmployee(@RequestBody Employee employee)
	{
		return new ResponseEntity<Employee>(service.addEmployee(employee),HttpStatus.OK);
	}
	@PutMapping("employee/update")
	public ResponseEntity<Employee> updateEmployee(@RequestBody Employee employee)
	{
		return new ResponseEntity<Employee>(service.updateEmployee(employee),HttpStatus.OK);
	}
	
	@DeleteMapping("/employee/delete")
	public ResponseEntity<Employee> deleteEmployee(@RequestParam Integer id)
	{
		return new ResponseEntity<Employee>(service.deleteEmployee(id),HttpStatus.OK);
	}

}
