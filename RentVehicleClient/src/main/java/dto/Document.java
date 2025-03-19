package dto;

import java.io.Serializable;

public class Document implements Serializable {

	private static final long serialVersionUID = 1L;
	private Integer id;
	private String number;
	
	
	public Document() {
		
	}

	public Document(Integer id, String number) {
		super();
		this.id = id;
		this.number = number;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}
	
	
}
