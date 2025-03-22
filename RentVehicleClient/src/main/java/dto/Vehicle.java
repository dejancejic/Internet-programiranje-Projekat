package dto;

import java.io.Serializable;

public class Vehicle implements Serializable{
	
	private static final long serialVersionUID = 1L;
	private Integer id;
	private String status;
	private String image;
	
	private String model;
	private String manufacturer;
		
	public Vehicle() {
		
	}

	public Vehicle(Integer id, String status, String image) {
		super();
		this.id = id;
		this.status = status;
		this.image = image;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public String getManufacturer() {
		return manufacturer;
	}

	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}
	
	

}
