package server.malfunction;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MalfunctionRepository extends JpaRepository<Malfunction, Integer>{

	List<Malfunction> findByVehicleId(Integer vehicleId);

}
