package server.vehicle.bike;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;




public interface BikeRepository extends JpaRepository<Bike, Integer>{

	Optional<Bike> findBybikeId(String bikeId);
}
