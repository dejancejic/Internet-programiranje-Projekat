package server.account;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import server.employee.EmployeeResponse;

@RestController
public class AuthenticationController {
	
	@Autowired
	private AuthenticationService authService;
	
	
	@PostMapping("/login/employee")
	public ResponseEntity<EmployeeResponse> loginAdmin(@RequestBody Account request,HttpServletResponse response)
	{
		return new ResponseEntity<EmployeeResponse>(authService.authenticateEmployee(request,response),HttpStatus.OK);
	}
	
	@PostMapping("/login/employee/token")
	public ResponseEntity<EmployeeResponse> loginAdmin(@CookieValue("jwt") String token,HttpServletResponse response)
	{
		return new ResponseEntity<EmployeeResponse>(authService.authenticateEmployeeToken(token,response),HttpStatus.OK);
	}

}
