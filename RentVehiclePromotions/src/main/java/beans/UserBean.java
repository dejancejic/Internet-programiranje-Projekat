package beans;

import java.io.Serializable;

public class UserBean implements Serializable {

	private static final long serialVersionUID = 5022669426687458041L;
	private String username;
	private String name;
	private String surname;
	private String token;
	private boolean loggedIn = false;
	
	
	public UserBean() {
		super();
	}
	public UserBean(String username, String name, String surname, String token, boolean loggedIn) {
		super();
		this.username = username;
		this.name = name;
		this.surname = surname;
		this.token = token;
		this.loggedIn = loggedIn;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSurname() {
		return surname;
	}
	public void setSurname(String surname) {
		this.surname = surname;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public boolean isLoggedIn() {
		return loggedIn;
	}
	public void setLoggedIn(boolean loggedIn) {
		this.loggedIn = loggedIn;
	}
	
	

}
