package dto;


public class Passport extends Document {
	
	private static final long serialVersionUID = 1L;

	private String passportNumber;
	
	public Passport() {
		super();
	}
	
	public Passport(Integer id, String number,String passportNumber) {
		super(id,number);
		this.passportNumber = passportNumber;
	}



	public String getPassportNumber() {
		return passportNumber;
	}

	public void setPassportNumber(String passportNumber) {
		this.passportNumber = passportNumber;
	}
	
	@Override
	public String toString()
	{
		return passportNumber;
	}
	

}
