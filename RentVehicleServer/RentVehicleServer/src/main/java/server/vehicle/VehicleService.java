package server.vehicle;

import java.time.LocalDate;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import server.exceptions.UniqueIdException;
import server.exceptions.VehicleNotFoundException;
import server.manufacturer.Manufacturer;
import server.manufacturer.ManufacturerRepository;
import server.vehicle.bike.Bike;
import server.vehicle.bike.BikeModel;
import server.vehicle.bike.BikeRepository;
import server.vehicle.car.Car;
import server.vehicle.car.CarModel;
import server.vehicle.car.CarRepository;
import server.vehicle.scooter.Scooter;
import server.vehicle.scooter.ScooterModel;
import server.vehicle.scooter.ScooterRepository;

@Service
public class VehicleService {

	private final CarRepository rpCar;
	private final VehicleRepository rpVehicle;
	private final ManufacturerRepository rpManufacturer;
	private final BikeRepository rpBike;
	private final ScooterRepository rpScooter;
	
	@Autowired
	public VehicleService(VehicleRepository rpVehicle,CarRepository rpCar,BikeRepository rpBike,ScooterRepository rpScooter,
			ManufacturerRepository rpManufacturer) {
		
		this.rpVehicle=rpVehicle;
		this.rpCar=rpCar;
		this.rpBike=rpBike;
		this.rpScooter=rpScooter;
		this.rpManufacturer=rpManufacturer;
	}


	public Page<Car> getCars(Pageable pageable,String query) {
		List<Car> allCars = rpCar.findAll();

		List<Car> filtered = new ArrayList<>();

		for (Car c : allCars) {
			if (!c.getDeleted()) {
				Manufacturer manu = rpManufacturer.findById(c.getManufacturerId()).orElse(null);
				if (manu != null && !manu.getDeleted()) {
					c.setManufacturer(manu.getName());
					filtered.add(c);
				}
			}
		}

		if (query != null && !query.trim().isEmpty()) {
			String lowerQuery = query.toLowerCase();
			filtered = filtered.stream()
					.filter(c ->
							(c.getCarId() != null && c.getCarId().toLowerCase().contains(lowerQuery)) ||
									(c.getManufacturer() != null && c.getManufacturer().toLowerCase().contains(lowerQuery))||
									(c.getModel() !=null && c.getModel().toLowerCase().contains(lowerQuery))||
									(c.getManufacturer()!=null && c.getModel()!=null && (c.getManufacturer().toLowerCase()+" "+c.getModel().toLowerCase()).toLowerCase().contains(lowerQuery))
					)
					.toList();
		}

		int start = (int) pageable.getOffset();
		int end = Math.min(start + pageable.getPageSize(), filtered.size());

		List<Car> pageContent = start >= filtered.size() ? Collections.emptyList() : filtered.subList(start, end);
		return new PageImpl<>(pageContent, pageable, filtered.size());
	}


	public Page<Bike> getBikes(Pageable pageable,String query) {
		List<Bike> allBikes = rpBike.findAll();
		List<Bike> filtered = new ArrayList<>();

		for (Bike b : allBikes) {
			if (!b.getDeleted()) {
				Manufacturer manu = rpManufacturer.findById(b.getManufacturerId()).orElse(null);
				if (manu != null && !manu.getDeleted()) {
					b.setManufacturer(manu.getName());
					filtered.add(b);
				}
			}
		}

		if (query != null && !query.trim().isEmpty()) {
			String lowerQuery = query.toLowerCase();
			filtered = filtered.stream()
					.filter(b ->
							(b.getBikeId() != null && b.getBikeId().toLowerCase().contains(lowerQuery)) ||
									(b.getManufacturer() != null && b.getManufacturer().toLowerCase().contains(lowerQuery))||
									(b.getModel() !=null && b.getModel().toLowerCase().contains(lowerQuery))||
									(b.getManufacturer()!=null && b.getModel()!=null && (b.getManufacturer().toLowerCase()+" "+b.getModel().toLowerCase()).toLowerCase().contains(lowerQuery))
					)
					.toList();
		}

		int start = (int) pageable.getOffset();
		int end = Math.min(start + pageable.getPageSize(), filtered.size());

		List<Bike> pageContent = start >= filtered.size() ? Collections.emptyList() : filtered.subList(start, end);
		return new PageImpl<>(pageContent, pageable, filtered.size());
	}

	public Page<Scooter> getScooters(Pageable pageable,String query) {
		List<Scooter> allScooters = rpScooter.findAll();
		List<Scooter> filtered = new ArrayList<>();

		for (Scooter s : allScooters) {
			if (!s.getDeleted()) {
				Manufacturer manu = rpManufacturer.findById(s.getManufacturerId()).orElse(null);
				if (manu != null && !manu.getDeleted()) {
					s.setManufacturer(manu.getName());
					filtered.add(s);
				}
			}
		}

		if (query != null && !query.trim().isEmpty()) {
			String lowerQuery = query.toLowerCase();
			filtered = filtered.stream()
					.filter(s ->
							(s.getScooterId() != null && s.getScooterId().toLowerCase().contains(lowerQuery)) ||
									(s.getManufacturer() != null && s.getManufacturer().toLowerCase().contains(lowerQuery))||
									(s.getModel() !=null && s.getModel().toLowerCase().contains(lowerQuery))||
									(s.getManufacturer()!=null && s.getModel()!=null && (s.getManufacturer().toLowerCase()+" "+s.getModel().toLowerCase()).toLowerCase().contains(lowerQuery))
					)
					.toList();
		}

		int start = (int) pageable.getOffset();
		int end = Math.min(start + pageable.getPageSize(), filtered.size());

		List<Scooter> pageContent = start >= filtered.size() ? Collections.emptyList() : filtered.subList(start, end);
		return new PageImpl<>(pageContent, pageable, filtered.size());
	}
	
	
	
	public Vehicle deleteVehicle(Integer id)
	{
		Vehicle v=rpVehicle.findById(id).orElseThrow(()->new VehicleNotFoundException("Vehicle with this ID doesn't exist!"));
		
		Optional<Car> c=rpCar.findById(id);
		Optional<Bike> b=rpBike.findById(id);
		Optional<Scooter> s=rpScooter.findById(id);
		
		if(c.isPresent())
		{
			Car car=c.get();
			car.setCarId((""+(new Random().nextInt(100000,999999))).hashCode()+"");
			rpCar.save(car);
			
		}
		else if(b.isPresent())
		{
			Bike bike=b.get();
			bike.setBikeId((""+(new Random().nextInt(100000,999999))).hashCode()+"");
			rpBike.save(bike);
		}
		else if(s.isPresent())
		{
			Scooter sc=s.get();
			sc.setScooterId((""+(new Random().nextInt(100000,999999))).hashCode()+"");
			rpScooter.save(sc);
		}
			
		
		v.setDeleted(true);
		
		v.setImage(null);
		rpVehicle.save(v);
		
		
		return v;
	}
	
	public Car addCar(CarModel car)
	{
		int indexOf=car.getImage().indexOf("base64,");
		String image=car.getImage();
		if(indexOf!=-1)
		image=car.getImage().substring(indexOf+7);
		
		Car c=new Car();
		
		c.setImage(Base64.getDecoder().decode(image));
		
		c.setId(null);
		c.setCarId(car.getCarId());
		c.setDescription(car.getDescription());
		c.setManufacturerId(car.getManufacturerId());
		c.setModel(car.getModel());
		c.setPrice(car.getPrice());
		c.setBuyDate(car.getBuyDate());
		
		
		Vehicle veh=c;
		
		if(rpCar.findBycarId(c.getCarId()).isPresent())
		{
			throw new UniqueIdException("Car with same car id already exists!");
		}
		
		veh.setId(null);
		veh.setStatus("free");
		
		
		
		veh=rpVehicle.save(veh);
		
		c.setId(veh.getId());
		if(c.getBuyDate()==null)
		c.setBuyDate(LocalDate.now());
		c.setManufacturer(rpManufacturer.findById(car.getManufacturerId()).get().getName());
		
		return rpCar.save(c);
	}
	
	public Bike addBike(BikeModel bike)
	{
		int indexOf=bike.getImage().indexOf("base64,");
		String image=bike.getImage();
		if(indexOf!=-1)
		image=bike.getImage().substring(indexOf+7);
		
		
		Bike b=new Bike();
		
		b.setImage(Base64.getDecoder().decode(image));
		
		b.setId(null);
		b.setBikeId(bike.getBikeId());
		
		b.setManufacturerId(bike.getManufacturerId());
		b.setModel(bike.getModel());
		b.setPrice(bike.getPrice());
		b.setRange(bike.getRange());
		
		
		
		Vehicle veh=(Vehicle)b;
		
		if(rpBike.findBybikeId(b.getBikeId()).isPresent())
		{
			throw new UniqueIdException("Bike with same bike id already exists!");
		}
		
		veh.setId(null);
		veh.setStatus("free");
		
		
		
		veh=rpVehicle.save(veh);
		
		b.setId(veh.getId());
		
		b.setManufacturer(rpManufacturer.findById(b.getManufacturerId()).get().getName());
		
		return rpBike.save(b);
	}
	
	
	public Scooter addScooter(ScooterModel scooter)
	{
		int indexOf=scooter.getImage().indexOf("base64,");
		String image=scooter.getImage();
		if(indexOf!=-1)
		image=scooter.getImage().substring(indexOf+7);
		
		
		Scooter s=new Scooter();
		
		s.setImage(Base64.getDecoder().decode(image));
		
		s.setId(null);
		s.setScooterId(scooter.getScooterId());
		
		s.setManufacturerId(scooter.getManufacturerId());
		s.setModel(scooter.getModel());
		s.setPrice(scooter.getPrice());
		s.setSpeed(scooter.getSpeed());
		
		
		
		Vehicle veh=(Vehicle)s;
		
		if(rpBike.findBybikeId(s.getScooterId()).isPresent())
		{
			throw new UniqueIdException("Scooter with same scooter id already exists!");
		}
		
		veh.setId(null);
		veh.setStatus("free");
		
		
		
		veh=rpVehicle.save(veh);
		
		s.setId(veh.getId());
		
		s.setManufacturer(rpManufacturer.findById(s.getManufacturerId()).get().getName());
		
		return rpScooter.save(s);
	}
	
	public Vehicle getVehicleById(Integer id)
	{
		Vehicle veh=null;
		
		Optional<Car> car=rpCar.findById(id);
		Optional<Bike> bike=rpBike.findById(id);
		Optional<Scooter> scooter=rpScooter.findById(id);
		
		if(car.isPresent())
		{
			veh=car.get();
			veh.setManufacturer(rpManufacturer.findById(car.get().getManufacturerId()).get().getName());
		}
		else if(bike.isPresent())
		{
			veh=bike.get();
			veh.setManufacturer(rpManufacturer.findById(bike.get().getManufacturerId()).get().getName());
		}
		else if(scooter.isPresent())
		{
			veh=scooter.get();
			veh.setManufacturer(rpManufacturer.findById(scooter.get().getManufacturerId()).get().getName());
		}
		
		
		return veh;
	}
	
	Car updateCarRentPrice(Car vehicle)
	{
		Optional<Car> car=rpCar.findById(vehicle.getId());
		if(car.isPresent())
		{
			Car c=car.get();
			c.setPrice(((Car)(vehicle)).getPrice());
			c=rpCar.save(c);
			return c;
		}
		throw new VehicleNotFoundException("Vehicle with given id doesn't exist!");
	}
	
	Bike updateBikeRentPrice(Bike vehicle)
	{
		Optional<Bike> bike=rpBike.findById(vehicle.getId());
		if(bike.isPresent())
		{
			Bike b=bike.get();
			b.setPrice(((Bike)(vehicle)).getPrice());
			b=rpBike.save(b);
			return b;
		}
		throw new VehicleNotFoundException("Vehicle with given id doesn't exist!");
	}
	
	Scooter updateScooterRentPrice(Scooter vehicle)
	{
		Optional<Scooter> scooter=rpScooter.findById(vehicle.getId());
		if(scooter.isPresent()) {
		Scooter s=scooter.get();
		s.setPrice(((Scooter)(vehicle)).getPrice());
		s=rpScooter.save(s);
		return s;
		}
		throw new VehicleNotFoundException("Vehicle with given id doesn't exist!");
	}
	
	
	
	

}
