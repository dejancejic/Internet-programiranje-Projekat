package server.vehicle.car;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface CarRepository extends JpaRepository<Car, Integer>{

	Optional<Car> findBycarId(String carId);
}
