package dto;

import java.time.LocalDate;

public class Car extends Vehicle{

	private static final long serialVersionUID = 1L;
	private String manufacturer;
	private String model;
	private String carId;
	private LocalDate dateBought;
	private Double price;
	private String description;
	
	
	public Car() {
	
	}
	
	public Car(String manufacturer, String model, String carId, LocalDate dateBought, Double price,
			String description) {
		super();
		this.manufacturer = manufacturer;
		this.model = model;
		this.carId = carId;
		this.dateBought = dateBought;
		this.price = price;
		this.description = description;
	}




	public String getManufacturer() {
		return manufacturer;
	}


	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}


	public String getModel() {
		return model;
	}


	public void setModel(String model) {
		this.model = model;
	}


	public String getCarId() {
		return carId;
	}


	public void setCarId(String carId) {
		this.carId = carId;
	}


	public LocalDate getDateBought() {
		return dateBought;
	}


	public void setDateBought(LocalDate dateBought) {
		this.dateBought = dateBought;
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
	
	

}
