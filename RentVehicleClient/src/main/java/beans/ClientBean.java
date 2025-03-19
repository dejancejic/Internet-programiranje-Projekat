package beans;

import java.io.Serializable;

import dao.ClientDAO;
import dto.Client;

public class ClientBean implements Serializable{

	private static final long serialVersionUID = 1L;
	private Client client=new Client();
	private boolean isLoggedIn = false;
	
	public ClientBean() {
		
	}
	
	
	public boolean login(String username, String password) {
		if ((client = ClientDAO.selectByUsernameAndPassword(username, password)) != null) {
			isLoggedIn = true;
			return true;
		}
		return false;
	}
	
	public boolean isLoggedIn() {
		return isLoggedIn;
	}

	public void logout() {
		client = new Client();
		isLoggedIn = false;
	}

	public Client getClient() {
		return client;
	}
	

}
