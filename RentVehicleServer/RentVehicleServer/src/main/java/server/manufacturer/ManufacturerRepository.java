package server.manufacturer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface ManufacturerRepository extends JpaRepository<Manufacturer, Integer> {
	
	

}
