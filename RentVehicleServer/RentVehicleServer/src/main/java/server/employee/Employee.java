package server.employee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import server.account.Account;

@Entity
@Table(name="employee")
@PrimaryKeyJoinColumn(name = "id")
public class Employee extends Account{

		
	@Column(name="role")
	private String role;

	
	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
	
	
	
	
}
