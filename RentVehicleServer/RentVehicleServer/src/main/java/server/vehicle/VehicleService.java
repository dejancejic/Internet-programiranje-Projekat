package server.vehicle;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import server.exceptions.UniqueIdException;
import server.exceptions.VehicleNotFoundException;
import server.manufacturer.ManufacturerRepository;
import server.vehicle.bike.Bike;
import server.vehicle.bike.BikeRepository;
import server.vehicle.car.Car;
import server.vehicle.car.CarRepository;
import server.vehicle.scooter.Scooter;
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
			c.setManufacturer(rpManufacturer.findById(c.getManufacturerId()).get().getName());
			toReturn.add(c);
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
	
	public Car addCar(Car car)
	{
		Vehicle veh=car;
		
		if(rpCar.findBycarId(car.getCarId()).isPresent())
		{
			throw new UniqueIdException("Car with same car id already exists!");
		}
		
		veh.setId(null);
		veh.setStatus("free");
		
		
		
		veh=rpVehicle.save(veh);
		
		car.setId(veh.getId());
		car.setRentDate(null);
		car.setManufacturer(rpManufacturer.findById(car.getManufacturerId()).get().getName());
		
		return rpCar.save(car);
	}
	
	

}
