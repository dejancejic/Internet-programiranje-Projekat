package beans;

import java.io.Serializable;
import java.util.ArrayList;

import dao.RentalDAO;
import dao.VehicleDAO;
import dto.Vehicle;

public class VehicleBean implements Serializable{

	private static final long serialVersionUID = 1L;
	
	private ArrayList<Vehicle> vehicles=null;
	
	public VehicleBean() {
		
	}
	
	
	
	
	public ArrayList<Vehicle> getVehicles() {
		return vehicles;
	}




	public void setVehicles(ArrayList<Vehicle> vehicles) {
		this.vehicles = vehicles;
	}




	public boolean getCars()
	{
		vehicles=VehicleDAO.getVehicleByType("car");

		return vehicles!=null;
	}
	
	public Vehicle getVehicle(Integer id)
	{
		return VehicleDAO.selectVehicleById(id);
	}
	
	public Vehicle updateVehicleStatus(Integer id,boolean rented)
	{
		return VehicleDAO.updateVehicleStatusById(id, rented);
	}
	
	public boolean getBikes()
	{
		vehicles=VehicleDAO.getVehicleByType("bike");

		return vehicles!=null;
	}
	
	public boolean getScooters()
	{
		vehicles=VehicleDAO.getVehicleByType("scooter");

		return vehicles!=null;
	}

}
