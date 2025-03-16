package server.manufacturer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ManufacturerService {
	
	private final ManufacturerRepository rp;
	
	private final CarManufacturerRepository rpCar;
	private final BikeManufacturerRepository rpBike;
	private final ScooterManufacturerRepository rpScooter;

	@Autowired
	public ManufacturerService(ManufacturerRepository rp,CarManufacturerRepository rpCar,
			BikeManufacturerRepository rpBike,ScooterManufacturerRepository rpScooter) {
		this.rp=rp;
		this.rpBike=rpBike;
		this.rpScooter=rpScooter;
		this.rpCar=rpCar;
	}

	
	public Manufacturer addManufacturer(Manufacturer m,String type)
	{
		m.setId(null);
		m.setDeleted(false);
		m=rp.save(m);
		
		if(type.equals("E-Car"))
		{
			CarManufacturer cm=new CarManufacturer();
			cm.setId(m.getId());
			
			rpCar.save(cm);
		}
		else if(type.equals("E-Bike"))
		{
			BikeManufacturer bm=new BikeManufacturer();
			bm.setId(m.getId());
			
			rpBike.save(bm);
		}
		else if(type.equals("E-Scooter"))
		{
			ScooterManufacturer sm=new ScooterManufacturer();
			sm.setId(m.getId());
			
			rpScooter.save(sm);
		}
		
		return m;
	}
	
	public Manufacturer updateManufacturer(Manufacturer m)
	{
		return rp.save(m);
	}
	
	public Manufacturer deleteManufacturer(Integer id)
	{
		Manufacturer m=rp.findById(id).get();
	
		m.setDeleted(true);
	
		
		return rp.save(m);
	}
	
	
	
	public HashMap<String,ArrayList<Manufacturer>> getAllManufacturers()
	{
		HashMap<String,ArrayList<Manufacturer>> map=new HashMap<String,ArrayList<Manufacturer>>();
		
		List<CarManufacturer> cars=rpCar.findAll();
		List<BikeManufacturer> bikes=rpBike.findAll();
		List<ScooterManufacturer> scooters=rpScooter.findAll();
		
		
		map.put("E-Car", new ArrayList<Manufacturer>());
		map.put("E-Bike", new ArrayList<Manufacturer>());
		map.put("E-Scooter", new ArrayList<Manufacturer>());
		
		
		for(CarManufacturer car:cars)
		{
			addToMap(map,car.getId(),"E-Car");
		}
		
		for(BikeManufacturer bike:bikes)
		{
			addToMap(map,bike.getId(),"E-Bike");
		}
		
		for(ScooterManufacturer scooter:scooters)
		{
			addToMap(map,scooter.getId(),"E-Scooter");
		}
		
		
		
		return map;
	}
	
	
	private void addToMap(HashMap<String,ArrayList<Manufacturer>> map,Integer id,String type)
	{
		Manufacturer m=rp.findById(id).get();
		if(m.getDeleted()==false) {
		ArrayList<Manufacturer> list=map.get(type);
		list.add(m);
		map.put(type, list);
		}
	}
	
	
	
}
