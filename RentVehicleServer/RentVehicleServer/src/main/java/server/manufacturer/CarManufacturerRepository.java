package server.manufacturer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface CarManufacturerRepository extends JpaRepository<CarManufacturer, Integer> {
    Page<CarManufacturer> findById(Integer id, Pageable pageable);
}
