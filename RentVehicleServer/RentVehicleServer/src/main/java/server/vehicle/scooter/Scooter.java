package server.vehicle.scooter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import server.vehicle.Vehicle;

@Entity
@Table(name="scooter")
@PrimaryKeyJoinColumn(name = "id")
public class Scooter extends Vehicle {

	

	@Column(name="scooter_id")
	private String scooterId;
	
	@Column(name="price")
	private Double price;
	
	@Column(name="speed")
	private Integer speed;
	
	@Column(name="model")
	private String model;
	
	@Column(name="manufacturer_id")
	private Integer manufacturerId;

	

	public String getScooterId() {
		return scooterId;
	}

	public void setScooterId(String scooterId) {
		this.scooterId = scooterId;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Integer getSpeed() {
		return speed;
	}

	public void setSpeed(Integer speed) {
		this.speed = speed;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public Integer getManufacturerId() {
		return manufacturerId;
	}

	public void setManufacturerId(Integer manufacturerId) {
		this.manufacturerId = manufacturerId;
	}
	
	
	
	

}
