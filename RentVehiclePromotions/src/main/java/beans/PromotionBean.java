package beans;

import java.io.Serializable;
import java.time.LocalDate;


public class PromotionBean implements Serializable {

	private static final long serialVersionUID = 967331115079287508L;
private Integer id;
	
	private String title;
	
	
	private LocalDate date;
	
	private String description;
	
	

	public PromotionBean() {
		super();
	}

	public PromotionBean(Integer id, String title, LocalDate date, String description) {
		super();
		this.id = id;
		this.title = title;
		this.date = date;
		this.description = description;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}
