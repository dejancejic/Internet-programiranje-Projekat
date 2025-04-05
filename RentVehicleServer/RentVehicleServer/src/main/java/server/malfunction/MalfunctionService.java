package server.malfunction;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
	
	public List<Malfunction> getVehicleMalfunctions(Integer id)
	{
		return rpMalfunction.findByVehicleId(id);
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
	
	public Malfunction solveMalfunction(Integer id)
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
		return mal;
	}

}
