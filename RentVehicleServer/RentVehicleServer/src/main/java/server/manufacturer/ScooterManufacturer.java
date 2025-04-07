package server.manufacturer;

import jakarta.persistence.*;

@Entity
@Table(name="scooter_manufacturer")
@PrimaryKeyJoinColumn(name = "id")
public class ScooterManufacturer extends Manufacturer {


	
	

}
