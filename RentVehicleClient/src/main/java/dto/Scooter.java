package dto;

public class Scooter extends Vehicle {

	private static final long serialVersionUID = 1L;
	private String manufacturer;
	private String model;
	private String scooterId;
	private Double price;
	private Integer speed;
	
	public Scooter() {
		
	}

	public Scooter(String manufacturer, String model, String scooterId, Double price, Integer speed) {
		super();
		this.manufacturer = manufacturer;
		this.model = model;
		this.scooterId = scooterId;
		this.price = price;
		this.speed = speed;
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

	
	
}
