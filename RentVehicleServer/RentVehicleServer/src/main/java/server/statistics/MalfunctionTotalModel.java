package server.statistics;

import java.util.List;

public class MalfunctionTotalModel {

	private String name;
	private List<RevenueModel> series;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<RevenueModel> getSeries() {
		return series;
	}
	public void setSeries(List<RevenueModel> series) {
		this.series = series;
	}
	public MalfunctionTotalModel(String name, List<RevenueModel> series) {
		super();
		this.name = name;
		this.series = series;
	}
	
	
	

}
