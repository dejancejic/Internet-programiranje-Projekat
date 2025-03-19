package server.vehicle.bike;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import server.vehicle.Vehicle;

@Entity
@Table(name="bike")
@PrimaryKeyJoinColumn(name = "id")
public class Bike extends Vehicle {
	
	@Column(name="bike_id")
	private String bikeId;
	
	@Column(name="price")
	private Double price;
	
	@Column(name="bike_range")
	private String range;
	
	@Column(name="model")
	private String model;
	
	@Column(name="manufacturer_id")
	private Integer manufacturerId;

	

	public String getBikeId() {
		return bikeId;
	}

	public void setBikeId(String bikeId) {
		this.bikeId = bikeId;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public String getRange() {
		return range;
	}

	public void setRange(String range) {
		this.range = range;
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
