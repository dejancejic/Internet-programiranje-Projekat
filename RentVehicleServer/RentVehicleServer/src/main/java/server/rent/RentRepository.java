package server.rent;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentRepository extends JpaRepository<Rent, Integer> {

	List<Rent> findByVehicleId(Integer vehicleId);
	Page<Rent> findByVehicleId(Integer vehicleId, Pageable pageable);
}
