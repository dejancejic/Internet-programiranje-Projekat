package server.malfunction;

import java.time.*;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import server.exceptions.VehicleNotFoundException;
import server.vehicle.Vehicle;
import server.vehicle.VehicleRepository;

@Service
public class MalfunctionService {

	@Autowired
	private MalfunctionRepository rpMalfunction;
	@Autowired
	private VehicleRepository rpVehicle;

	public Page<Malfunction> getVehicleMalfunctions(Integer id, int page, int size, String query) {
		Pageable pageable = PageRequest.of(page, size);

		if (query == null || query.trim().isEmpty()) {
			return rpMalfunction.findByVehicleId(id, pageable);
		}

		try {
			query = query.trim();
			LocalDateTime start;
			LocalDateTime end;

			if (query.matches("\\d{4}-\\d{2}-\\d{2}")) {
				LocalDate date = LocalDate.parse(query);
				start = date.atStartOfDay();
				end = date.atTime(LocalTime.MAX);
			} else if (query.matches("\\d{4}-\\d{2}")) {
				YearMonth ym = YearMonth.parse(query);
				start = ym.atDay(1).atStartOfDay();
				end = ym.atEndOfMonth().atTime(LocalTime.MAX);
			} else if (query.matches("\\d{4}")) {

				Year year = Year.parse(query);
				start = year.atDay(1).atStartOfDay();
				end = year.atMonth(12).atEndOfMonth().atTime(LocalTime.MAX);
			} else {
				return Page.empty(pageable);
			}

			return rpMalfunction.findByVehicleIdAndDateTimeBetween(id, start, end, pageable);

		} catch (Exception e) {
			return Page.empty(pageable); 
		}
	}



	public Page<Malfunction> getVehicleMalfunctions(Integer id, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return rpMalfunction.findByVehicleId(id, pageable);
	}
	
	public Malfunction addMalfunction(Malfunction malfunction)
	{
		Vehicle veh=rpVehicle.findById(malfunction.getVehicleId()).
				orElseThrow(()-> new VehicleNotFoundException("Vehicle with that id doesn't exist!"));
		
		veh.setStatus("broken");
		malfunction.setSolved(false);
		rpVehicle.save(veh);
		
		malfunction=rpMalfunction.save(malfunction);
		
		return malfunction;
	}
	
	public Boolean solveMalfunction(Integer id)
	{
		Malfunction mal=rpMalfunction.findById(id).orElseThrow(()->new VehicleNotFoundException("Malfunction with that id doesn't exist!"));
		
		Vehicle veh=rpVehicle.findById(mal.getVehicleId()).
				orElseThrow(()-> new VehicleNotFoundException("Vehicle with that id doesn't exist!"));

		mal.setSolved(true);
		rpMalfunction.save(mal);

		List<Malfunction> malfunctions=rpMalfunction.findByVehicleId(veh.getId());
		boolean found=false;
		for(Malfunction m:malfunctions)
		{
			if(m.getSolved()==false)
			{
				found=true;
				break;
			}
		}

		if(found==false)
		{
			veh.setStatus("free");
			rpVehicle.save(veh);
		}

		return found;
	}

}
