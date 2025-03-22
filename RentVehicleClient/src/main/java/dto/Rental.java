package dto;

import java.io.Serializable;

import java.time.LocalDateTime;


public class Rental implements Serializable{

	private static final long serialVersionUID = 1L;
	private Integer id;
	private LocalDateTime date;
	private String takenX;
	private String takenY;
	private String leftX;
	private String leftY;
	private LocalDateTime duration;
	private Vehicle vehicle;
	
	

	public Rental() {
		
	}

	public Rental(Integer id, LocalDateTime date, String takenX, String takenY, String leftX, String leftY,
			LocalDateTime duration, Vehicle vehicle) {
		super();
		this.id = id;
		this.date = date;
		this.takenX = takenX;
		this.takenY = takenY;
		this.leftX = leftX;
		this.leftY = leftY;
		this.duration = duration;
		this.vehicle = vehicle;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public LocalDateTime getDate() {
		return date;
	}

	public void setDate(LocalDateTime date) {
		this.date = date;
	}

	public String getTakenX() {
		return takenX;
	}

	public void setTakenX(String takenX) {
		this.takenX = takenX;
	}

	public String getTakenY() {
		return takenY;
	}

	public void setTakenY(String takenY) {
		this.takenY = takenY;
	}

	public String getLeftX() {
		return leftX;
	}

	public void setLeftX(String leftX) {
		this.leftX = leftX;
	}

	public String getLeftY() {
		return leftY;
	}

	public void setLeftY(String leftY) {
		this.leftY = leftY;
	}

	public LocalDateTime getDuration() {
		return duration;
	}

	public void setDuration(LocalDateTime duration) {
		this.duration = duration;
	}

	public Vehicle getVehicle() {
		return vehicle;
	}

	public void setVehicle(Vehicle vehicle) {
		this.vehicle = vehicle;
	}
	
	

}
