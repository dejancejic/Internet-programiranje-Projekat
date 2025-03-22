package dto;

public class Bike extends Vehicle{

	private static final long serialVersionUID = 1L;
	private String manufacturer;
	private String model;
	private String bikeId;
	private Double price;
	private String range;
	
	public Bike() {
	
	}
	public Bike(String manufacturer, String model, String bikeId, Double price, String range) {
		super();
		this.manufacturer = manufacturer;
		this.model = model;
		this.bikeId = bikeId;
		this.price = price;
		this.range = range;
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

	
	
}
