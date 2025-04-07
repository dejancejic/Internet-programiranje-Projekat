package server.manufacturer;

import jakarta.persistence.*;

@Entity
@Table(name="bike_manufacturer")
@PrimaryKeyJoinColumn(name = "id")
public class BikeManufacturer extends Manufacturer {

	

}
