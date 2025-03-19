package server.vehicle.scooter;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface ScooterRepository extends JpaRepository<Scooter, Integer> {

	Optional<Scooter> findByscooterId(String scooterId);
}
