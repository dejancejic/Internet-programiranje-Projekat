package server.statistics;

public class RevenueModel {

	private String name;
	private Double value;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Double getValue() {
		return value;
	}
	public void setValue(Double value) {
		this.value = value;
	}
	public RevenueModel(String name, Double value) {
		super();
		this.name = name;
		this.value = value;
	}
	
	

}
