package server.rent;

import server.vehicle.Vehicle;

public class RentMapModel {

	
	private Vehicle vehicle;
	private String x;
	private String y;
	
	
	public RentMapModel(Vehicle vehicle, String x, String y) {
		super();
		this.vehicle = vehicle;
		this.x = x;
		this.y = y;
	}
	public Vehicle getVehicle() {
		return vehicle;
	}
	public void setVehicle(Vehicle vehicle) {
		this.vehicle = vehicle;
	}
	public String getX() {
		return x;
	}
	public void setX(String x) {
		this.x = x;
	}
	public String getY() {
		return y;
	}
	public void setY(String y) {
		this.y = y;
	}
	
	
	

}
