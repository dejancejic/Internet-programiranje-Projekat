package server.manufacturer;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import server.rent.Rent;

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


		if(type.equals("E-Car"))
		{
			CarManufacturer cm=new CarManufacturer();
			cm.setId(m.getId());
			setParameters(cm,m);
			
			rpCar.save(cm);
		}
		else if(type.equals("E-Bike"))
		{
			BikeManufacturer bm=new BikeManufacturer();
			bm.setId(m.getId());
			setParameters(bm,m);
			
			rpBike.save(bm);
		}
		else if(type.equals("E-Scooter"))
		{
			ScooterManufacturer sm=new ScooterManufacturer();
			sm.setId(m.getId());
			setParameters(sm,m);

			rpScooter.save(sm);
		}
		
		return m;
	}
	
	public Manufacturer updateManufacturer(Manufacturer m)
	{
		CarManufacturer cm=rpCar.findById(m.getId()).orElse(null);
		BikeManufacturer bm=rpBike.findById(m.getId()).orElse(null);
		ScooterManufacturer sm=rpScooter.findById(m.getId()).orElse(null);


		if(cm!=null){
			setParameters(cm,m);
			return rpCar.save(cm);
		}
		else if(bm!=null){
			setParameters(bm,m);
			return rpBike.save(bm);
		}
		else if(sm!=null){
			setParameters(sm,m);
			return rpScooter.save(sm);
		}

		return null;
	}
	private void setParameters(Manufacturer m,Manufacturer m1)
	{
		m.setAddress(m1.getAddress());
		m.setCountry(m1.getCountry());
		m.setName(m1.getName());
		m.setPhone(m1.getPhone());
		m.setEmail(m1.getEmail());
		m.setFax(m1.getFax());
		m.setDeleted(m1.getDeleted());
	}
	public Manufacturer deleteManufacturer(Integer id)
	{
		Manufacturer m=rp.findById(id).get();
	
		m.setDeleted(true);
	
		
		return rp.save(m);
	}
	
	
	
//	public HashMap<String,ArrayList<Manufacturer>> getAllManufacturers()
//	{
//		HashMap<String,ArrayList<Manufacturer>> map=new HashMap<>();
//
//		List<CarManufacturer> cars=rpCar.findAll();
//		List<BikeManufacturer> bikes=rpBike.findAll();
//		List<ScooterManufacturer> scooters=rpScooter.findAll();
//
//
//		map.put("E-Car", new ArrayList<Manufacturer>());
//		map.put("E-Bike", new ArrayList<Manufacturer>());
//		map.put("E-Scooter", new ArrayList<Manufacturer>());
//
//
//		for(CarManufacturer car:cars)
//		{
//			addToMap(map,car.getId(),"E-Car");
//		}
//
//		for(BikeManufacturer bike:bikes)
//		{
//			addToMap(map,bike.getId(),"E-Bike");
//		}
//
//		for(ScooterManufacturer scooter:scooters)
//		{
//			addToMap(map,scooter.getId(),"E-Scooter");
//		}
//
//
//
//		return map;
//	}



	public HashMap<String, Page<Manufacturer>> getAllManufacturers(Pageable pageable, String query)
	{
		HashMap<String,Page<Manufacturer>> map=new HashMap<>();

		List<CarManufacturer> cars=rpCar.findAll();
		List<BikeManufacturer> bikes=rpBike.findAll();
		List<ScooterManufacturer> scooters=rpScooter.findAll();

		List<Manufacturer> processedCars=new ArrayList<>();
		List<Manufacturer> processedBikes=new ArrayList<>();
		List<Manufacturer> processedScooters=new ArrayList<>();

		for(CarManufacturer cm:cars)
		{
			if(!cm.getDeleted()){
				processedCars.add(cm);
			}
		}
		for(BikeManufacturer bm:bikes)
		{
			if(!bm.getDeleted()){
				processedBikes.add(bm);
			}
		}
		for(ScooterManufacturer sm:scooters)
		{
			if(!sm.getDeleted()){
				processedScooters.add(sm);
			}
		}
		Page<Manufacturer> carsPage=filterAndPaginate(processedCars,query,pageable);
		Page<Manufacturer> bikesPage=filterAndPaginate(processedBikes,query,pageable);
		Page<Manufacturer> scootersPage=filterAndPaginate(processedScooters,query,pageable);

		map.put("E-Car",carsPage);
		map.put("E-Bike",bikesPage);
		map.put("E-Scooter",scootersPage);

	return map;
	}
	private Page<Manufacturer> filterAndPaginate(List<Manufacturer> manufacturers, String queryInitial, Pageable pageable) {
		Stream<Manufacturer> stream = manufacturers.stream();

		if (queryInitial != null && !queryInitial.trim().isEmpty()) {
			String query = queryInitial.toLowerCase();
			stream = stream.filter(r -> {
				String name = r.getName().toLowerCase();
				return name.contains(query);
			});
		}

		List<Manufacturer> filtered = stream.toList();

		int start = (int) pageable.getOffset();
		int end = Math.min(start + pageable.getPageSize(), filtered.size());

		List<Manufacturer> paged = start >= filtered.size() ? Collections.emptyList() : filtered.subList(start, end);
		return new PageImpl<>(paged, pageable, filtered.size());
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
