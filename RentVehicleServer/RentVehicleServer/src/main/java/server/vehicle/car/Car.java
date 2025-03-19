package server.vehicle.car;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import server.vehicle.Vehicle;

@Entity
@Table(name="car")
@PrimaryKeyJoinColumn(name = "id")
public class Car extends Vehicle {

	
	@Column(name="car_id")
	private String carId;
	
	@Column(name="buy_date")
	private LocalDate buyDate;
	
	@Column(name="price")
	private Double price;
	
	@Column(name="description")
	private String description;
	
	@Column(name="model")
	private String model;
	
	@Column(name="manufacturer_id")
	private Integer manufacturerId;
	


	public String getCarId() {
		return carId;
	}

	public void setCarId(String carId) {
		this.carId = carId;
	}

	

	public LocalDate getBuyDate() {
		return buyDate;
	}

	public void setBuyDate(LocalDate buyDate) {
		this.buyDate = buyDate;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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
