package server.malfunction;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MalfunctionRepository extends JpaRepository<Malfunction, Integer>{

	List<Malfunction> findByVehicleId(Integer vehicleId);
	Page<Malfunction> findByVehicleId(Integer id, Pageable pageable);
	Page<Malfunction> findByVehicleIdAndDateTimeBetween(
			Integer vehicleId,
			LocalDateTime start,
			LocalDateTime end,
			Pageable pageable
	);


}
