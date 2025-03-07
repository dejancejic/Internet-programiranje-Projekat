package server.scooter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="scooter")
public class Scooter {

	@Id
	@Column(name="id")
	private Integer id;
	
	
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

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

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
