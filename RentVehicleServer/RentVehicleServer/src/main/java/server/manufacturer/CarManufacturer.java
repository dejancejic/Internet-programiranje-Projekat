package server.manufacturer;

import jakarta.persistence.*;

@Entity
@Table(name="car_manufacturer")
@PrimaryKeyJoinColumn(name = "id")
public class CarManufacturer extends Manufacturer {


	
	
	

}
