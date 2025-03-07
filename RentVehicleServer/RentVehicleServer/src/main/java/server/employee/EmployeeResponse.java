package server.employee;

public class EmployeeResponse {
	
	private Employee employee;
	private String token;
	public EmployeeResponse(Employee employee, String token) {
		super();
		this.employee = employee;
		this.token = token;
	}
	public Employee getEmployee() {
		return employee;
	}
	public void setEmployee(Employee employee) {
		this.employee = employee;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	
	

}
