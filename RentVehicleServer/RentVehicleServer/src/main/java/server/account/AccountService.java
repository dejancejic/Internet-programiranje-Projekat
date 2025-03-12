package server.account;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import server.client.Client;
import server.client.ClientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import server.employee.Employee;
import server.employee.EmployeeRepository;
import server.exceptions.UserAlreadyExistsException;
import server.exceptions.UserNotFoundException;

@Service
public class AccountService {

	@Autowired
	private AccountRepository rpAccount;
	@Autowired
	private ClientRepository rpClient;
	@Autowired
	private EmployeeRepository rpEmployee;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	
	public List<Employee> getEmployees()
	{
		return rpEmployee.findAll();
	}
	
	public List<Client> getClients()
	{
		return rpClient.findAll();
	}
	
	public Client setStatus(Integer id,Boolean status)
	{
		Client c=rpClient.findById(id).orElseThrow(()->new UserNotFoundException("Client with that id doesn't exist!"));
		
		c.setBlocked(status);
		
		return rpClient.save(c);
	}
	
	public Employee deleteEmployee(Integer id)
	{
		Optional<Employee> emp=rpEmployee.findById(id);
		if(!emp.isPresent())
		{
			throw new UserNotFoundException("Employee with that id doesn't exist!");
		}
		rpEmployee.deleteById(id);
		
		return emp.get();
	}
	
	public Employee addEmployee(Employee employee)
	{
		Optional<Account> emp=rpAccount.findByusername(employee.getUsername());
		if(emp.isPresent())
		{
			throw new UserAlreadyExistsException("Employee with that username already exists!");
		}
		employee.setId(null);
		employee.setPassword(passwordEncoder.encode(employee.getPassword()));
		
		employee=rpEmployee.save(employee);
		return employee;
	}
	
	public Employee updateEmployee(Employee employee)
	{
		Employee e=rpEmployee.findById(employee.getId()).get();
		
		Optional<Account> emp=rpAccount.findByusername(employee.getUsername());
		if(emp.isPresent() && !e.getUsername().equals(emp.get().getUsername()))
		{
			throw new UserAlreadyExistsException("Employee with that username already exists!");
		}
		
		employee=rpEmployee.save(employee);
		return employee;
	}
	
	
	

}
