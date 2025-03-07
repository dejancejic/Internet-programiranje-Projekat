package server.vehicle.bike;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface BikeRepository extends JpaRepository<Bike, Integer>{

}
