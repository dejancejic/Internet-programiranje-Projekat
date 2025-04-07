package server.account;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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


	public Page<Employee> getEmployees(Pageable pageable, String query)
	{
		List<Employee> allEmployees = rpEmployee.findAll();

		if (query != null && !query.trim().isEmpty()) {
			String lowerQuery = query.toLowerCase();
			allEmployees = allEmployees.stream()
					.filter(c -> {
						String name = c.getName().toLowerCase();
						String surname = c.getSurname().toLowerCase();
						String fullName = name + " " + surname;
						return name.contains(lowerQuery) ||
								surname.contains(lowerQuery) ||
								fullName.contains(lowerQuery);
					})
					.toList();
		}
		int start = (int) pageable.getOffset();
		int end = Math.min(start + pageable.getPageSize(), allEmployees.size());

		List<Employee> pageContent = start >= allEmployees.size()
				? Collections.emptyList()
				: allEmployees.subList(start, end);

		return new PageImpl<>(pageContent, pageable, allEmployees.size());
	}
	
	public Page<Client> getClients(Pageable pageable, String query)
	{
		List<Client> allClients = rpClient.findAll();

		if (query != null && !query.trim().isEmpty()) {
			String lowerQuery = query.toLowerCase();
			allClients = allClients.stream()
					.filter(c -> {
						String name = c.getName().toLowerCase();
						String surname = c.getSurname().toLowerCase();
						String fullName = name + " " + surname;
						String email = c.getEmail().toLowerCase();
						return name.contains(lowerQuery) ||
								surname.contains(lowerQuery) ||
								fullName.contains(lowerQuery) ||
								email.contains(lowerQuery);
					})
					.toList();
		}
		int start = (int) pageable.getOffset();
		int end = Math.min(start + pageable.getPageSize(), allClients.size());

		List<Client> pageContent = start >= allClients.size()
				? Collections.emptyList()
				: allClients.subList(start, end);

		return new PageImpl<>(pageContent, pageable, allClients.size());
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
		if(employee.getPassword()==null || employee.getPassword().trim().equals(""))
		{
			employee.setPassword(e.getPassword());
		}
		else
		{
			employee.setPassword(passwordEncoder.encode(employee.getPassword()));
		}
		
		employee=rpEmployee.save(employee);
		return employee;
	}
	
	
	

}
