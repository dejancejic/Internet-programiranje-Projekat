package server.rent;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import server.client.Client;
import server.client.ClientRepository;
import server.exceptions.UserNotFoundException;
import server.manufacturer.Manufacturer;
import server.manufacturer.ManufacturerRepository;
import server.rent.car.CarRent;
import server.rent.car.CarRentRepository;
import server.vehicle.bike.Bike;
import server.vehicle.bike.BikeRepository;
import server.vehicle.car.Car;
import server.vehicle.car.CarRepository;
import server.vehicle.scooter.Scooter;
import server.vehicle.scooter.ScooterRepository;

@Service
public class RentService {

	@Autowired
	private RentRepository rpRent;
	
	@Autowired
	private CarRentRepository rpCarRent;
	
	@Autowired
	private ClientRepository rpClient;
	
	@Autowired
	private CarRepository rpCar;
	
	@Autowired
	private BikeRepository rpBike;
	
	@Autowired
	private ScooterRepository rpScooter;
	
	
	
	
	public List<Rent> getVehicleRents(Integer idVehicle)
	{
		List<Rent> rents=rpRent.findByVehicleId(idVehicle);
		
		for(Rent r:rents)
		{
			Optional<CarRent> crent=rpCarRent.findById(r.getId());
			if(crent.isPresent())
			{
				r=crent.get();
			}
			Client cl=rpClient.findById(r.getClientId()).orElseThrow(()->new UserNotFoundException("User doesn't exist!"));
			r.setClient(cl);
		}
		return rents;
	}
	
	public HashMap<String,List<Rent>> getAllRents()
	{
		HashMap<String,List<Rent>> map=new HashMap<String,List<Rent>>();
		List<CarRent> carRents=rpCarRent.findAll();
		List<Rent> rentalsCar=new ArrayList<Rent>();
		List<Rent> bikeRents=new ArrayList<Rent>();
		List<Rent> scooterRents=new ArrayList<Rent>();
		
		for(CarRent cr:carRents)
		{
			Client cl=rpClient.findById(cr.getClientId()).orElseThrow(()->new UserNotFoundException("User doesn't exist!"));
			cr.setClient(cl);
			Car car=rpCar.findById(cr.getVehicleId()).get();
			
			cr.setVehicleName(car.getCarId());
			rentalsCar.add(cr);
		}
		map.put("cars", rentalsCar);
		
		List<Rent>all= rpRent.findAll();
		
		for(Rent r:all)
		{
			Optional<Bike> bike=rpBike.findById(r.getVehicleId());
			Optional<Scooter> scooter=rpScooter.findById(r.getVehicleId());
			if(bike.isPresent())
			{
				Client cl=rpClient.findById(r.getClientId()).orElseThrow(()->new UserNotFoundException("User doesn't exist!"));
				r.setClient(cl);
				r.setVehicleName(bike.get().getBikeId());
				bikeRents.add(r);
			}
			else if(scooter.isPresent())
			{
				Client cl=rpClient.findById(r.getClientId()).orElseThrow(()->new UserNotFoundException("User doesn't exist!"));
				r.setClient(cl);
				r.setVehicleName(scooter.get().getScooterId());
				scooterRents.add(r);
			}
		}
		map.put("bikes", bikeRents);
		map.put("scooters", scooterRents);
		
	
		return map;
	}
	
	
	public HashMap<String,List<RentMapModel>> getMapModels()
	{
		HashMap<String,List<RentMapModel>> map=new HashMap<String,List<RentMapModel>>();
		
		List<RentMapModel> modelsCar=new ArrayList<RentMapModel>();
		List<RentMapModel> modelsBike=new ArrayList<RentMapModel>();
		List<RentMapModel> modelsScooter=new ArrayList<RentMapModel>();
		
		List<Car> cars=rpCar.findAll();
		List<Bike> bikes=rpBike.findAll();
		List<Scooter> scooters=rpScooter.findAll();
		
		for(Car c:cars)
		{
			List<Rent> rentCars=rpRent.findByVehicleId(c.getId());
			
			rentCars.sort((a,b)->{
				if(a.getDateTime().isAfter(b.getDateTime()))
					return 1;
				else if(a.getDateTime().isBefore(b.getDateTime()))
					return -1;
				
				return 0;
			});
			if(rentCars.size()>0)
			{
				modelsCar.add(new RentMapModel(c,rentCars.get(0).getLeftX(),rentCars.get(0).getLeftY()));
			}
			
		}
		for(Bike bike:bikes)
		{
			List<Rent> rentBikes=rpRent.findByVehicleId(bike.getId());
			
			rentBikes.sort((a,b)->{
				if(a.getDateTime().isAfter(b.getDateTime()))
					return 1;
				else if(a.getDateTime().isBefore(b.getDateTime()))
					return -1;
				
				return 0;
			});
			if(rentBikes.size()>0)
			{
				modelsBike.add(new RentMapModel(bike,rentBikes.get(0).getLeftX(),rentBikes.get(0).getLeftY()));
			}
			
		}
		
		for(Scooter scooter:scooters)
		{
			List<Rent> rentScooters=rpRent.findByVehicleId(scooter.getId());
			
			rentScooters.sort((a,b)->{
				if(a.getDateTime().isAfter(b.getDateTime()))
					return 1;
				else if(a.getDateTime().isBefore(b.getDateTime()))
					return -1;
				
				return 0;
			});
			if(rentScooters.size()>0)
			{
				modelsScooter.add(new RentMapModel(scooter,rentScooters.get(0).getLeftX(),rentScooters.get(0).getLeftY()));
			}
			
		}
		
		
		
		map.put("E-Car", modelsCar);
		map.put("E-Bike", modelsBike);
		map.put("E-Scooter", modelsScooter);
		
		return map;
	}
	

}
