package server.account;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;
import server.employee.Employee;
import server.employee.EmployeeRepository;
import server.employee.EmployeeResponse;
import server.exceptions.AccessDeniedException;
import server.exceptions.UserNotFoundException;

@Service
public class AuthenticationService {
	
	private final AccountRepository rp;
	private final EmployeeRepository rpEmployee;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	
	@Autowired
	public AuthenticationService(AccountRepository rp,EmployeeRepository rpEmployee,PasswordEncoder passwordEncoder,
			JwtService jwtService,AuthenticationManager authenticationManager) {
		
		this.rp = rp;
		this.rpEmployee=rpEmployee;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
		this.authenticationManager = authenticationManager;
	}
	
	public EmployeeResponse authenticateEmployee(Account request,HttpServletResponse response) {
		Account user=rp.findByusername(request.getUsername()).orElseThrow(()->new AccessDeniedException("Credentials are not valid!"));
				
		try {
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
		}catch(Exception ex)
		{
			throw new AccessDeniedException("Credentials are not valid!");
		}
		
		String token=jwtService.generateToken(user);
	
		
		Employee employee=rpEmployee.findById(user.getId()).orElseThrow(()->new UserNotFoundException("Employee with that username doesn't exist!"));
		
		response.setHeader(HttpHeaders.SET_COOKIE, jwtService.setTokenCookie(token, false).toString());
		
		return new EmployeeResponse(employee, token);
	}
	
	public EmployeeResponse authenticateEmployeeToken(String token,HttpServletResponse response) {
		
		String username=jwtService.extractUsername(token);
				
	
		Account user=rp.findByusername(username).orElseThrow(()->new UserNotFoundException("Employee with that username doesn't exist!"));
		Employee employee=rpEmployee.findById(user.getId()).orElseThrow(()->new UserNotFoundException("Employee with that username doesn't exist!"));
		
		response.setHeader(HttpHeaders.SET_COOKIE, jwtService.setTokenCookie(token, false).toString());
		return new EmployeeResponse(employee, token);
	}

	
	
}
