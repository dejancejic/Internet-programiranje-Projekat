package server.vehicle;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import server.bike.BikeRepository;
import server.car.Car;
import server.car.CarRepository;
import server.exceptions.VehicleNotFoundException;
import server.manufacturer.ManufacturerRepository;
import server.scooter.ScooterRepository;

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
		for(Car c:cars)
		{
			c.setManufacturer(rpManufacturer.findById(c.getManufacturerId()).get().getName());
		}
		return cars;
	}
	
	public Car deleteCar(Integer id)
	{
		Car c=rpCar.findById(id).orElseThrow(()->new VehicleNotFoundException("Car with this ID doesn't exist!"));
		
		rpCar.deleteById(id);
		
		rpVehicle.deleteById(id);
		
		
		//TODO HANDLE DELETING OF OTHER CLASSES DEPENDING ON CAR!
		
		
		
		return c;
	}
	
	public Car addCar(Car car)
	{
		Vehicle veh=car;
		
		veh.setId(null);
		
		
		veh=rpVehicle.save(veh);
		
		car.setId(veh.getId());
		
		return rpCar.save(car);
	}
	
	

}
