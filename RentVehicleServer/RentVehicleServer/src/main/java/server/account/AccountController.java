package server.account;

import java.util.List;

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

import server.client.Client;
import server.employee.Employee;

@RestController
@RequestMapping("/account")
public class AccountController {

	@Autowired
	private AccountService service;
	
	
	@GetMapping("/clients")
	public Page<Client> getClients(@RequestParam(defaultValue = "0") int page,
									@RequestParam(defaultValue = "6") int size,
									@RequestParam(defaultValue = "") String query)
	{
		return service.getClients(PageRequest.of(page, size), query);
	}
	
	@GetMapping("/employees")
	public Page<Employee> getEmployees(@RequestParam(defaultValue = "0") int page,
													   @RequestParam(defaultValue = "6") int size,
													   @RequestParam(defaultValue = "") String query)
	{
		return service.getEmployees(PageRequest.of(page, size), query);
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
