package server.vehicle;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
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
	
	
	public List<Car> getCars()
	{
		List<Car> cars=rpCar.findAll();
		List<Car> toReturn=new ArrayList<Car>();
		
		for(Car c:cars)
		{
			if(c.getDeleted()==false) {
				Manufacturer manu=rpManufacturer.findById(c.getManufacturerId()).get();
				if(manu.getDeleted()==false) {
					c.setManufacturer(manu.getName());
					toReturn.add(c);
				}
			}
		}
		return toReturn;
	}
	
	public List<Bike> getBikes()
	{
		List<Bike> bikes=rpBike.findAll();
		List<Bike> toReturn=new ArrayList<Bike>();
		
		for(Bike b:bikes)
		{
			if(b.getDeleted()==false) {
				Manufacturer manu=rpManufacturer.findById(b.getManufacturerId()).get();
				if(manu.getDeleted()==false) {
			b.setManufacturer(manu.getName());
			toReturn.add(b);
				}
			}
		}
		return toReturn;
	}
	
	public List<Scooter> getScooters()
	{
		List<Scooter> scooters=rpScooter.findAll();
		List<Scooter> toReturn=new ArrayList<Scooter>();
		
		for(Scooter s:scooters)
		{
			if(s.getDeleted()==false) {
			Manufacturer manu=rpManufacturer.findById(s.getManufacturerId()).get();
				if(manu.getDeleted()==false) {
					s.setManufacturer(manu.getName());
					toReturn.add(s);
				}
			}
		}
		return toReturn;
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
