package beans;

import java.io.Serializable;
import java.util.ArrayList;

import dao.RentalDAO;
import dto.Rental;

public class RentBean implements Serializable{

	private static final long serialVersionUID = 1L;
	
	private ArrayList<Rental> rents=null;
	
	private Integer idClient=-1;
	
	public RentBean() {
	}

	public ArrayList<Rental> getRents() {
		
		return rents;
	}

	public void setRents(ArrayList<Rental> rents) {
		this.rents = rents;
	}
	
	public boolean getClientRents(Integer idClient)
	{
		this.idClient=idClient;
		rents=RentalDAO.selectClientRentals(idClient);

		return rents!=null;
	}
	
	
	public boolean addRent(Rental rental)
	{
		return RentalDAO.insertRental(rental)!=null;
	}
	
	

}
