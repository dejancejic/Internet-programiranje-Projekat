package server.rent;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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




	public Page<Rent> getVehicleRents(Integer idVehicle,Pageable pageable,String clientName) {
		Page<Rent> rents = rpRent.findByVehicleId(idVehicle, pageable);
		List<Rent> processedRents = new ArrayList<>();

		for (Rent r : rents.getContent()) {
			Optional<CarRent> crent = rpCarRent.findById(r.getId());
			if (crent.isPresent()) {
				r = crent.get();
			}

			Client cl = rpClient.findById(r.getClientId())
					.orElseThrow(() -> new UserNotFoundException("User doesn't exist!"));
			r.setClient(cl);

			processedRents.add(r);
		}

		if (clientName != null && !clientName.trim().isEmpty()) {
			List<Rent> filtered = processedRents.stream()
					.filter(r ->
							r.getClient().getName().toLowerCase().contains(clientName.toLowerCase()) ||
							r.getClient().getSurname().toLowerCase().contains(clientName.toLowerCase()) ||
									(r.getClient().getName()+" "+r.getClient().getSurname()).toLowerCase().contains(clientName.toLowerCase())
					)
					.toList();

			return new PageImpl<>(filtered, pageable, filtered.size());
		}

		return new PageImpl<>(processedRents, pageable, rents.getTotalElements());
	}

	public Map<String, Page<Rent>> getAllRents(Pageable pageable,String query) {
		List<Rent> carRentsProcessed = new ArrayList<>();
		List<Rent> bikeRentsProcessed = new ArrayList<>();
		List<Rent> scooterRentsProcessed = new ArrayList<>();

		for (CarRent cr : rpCarRent.findAll()) {
			Client cl = rpClient.findById(cr.getClientId())
					.orElseThrow(() -> new UserNotFoundException("User doesn't exist!"));
			cr.setClient(cl);

			Car car = rpCar.findById(cr.getVehicleId()).orElse(null);
			if (car != null && !car.getDeleted()) {
				cr.setVehicleName(car.getCarId());
				carRentsProcessed.add(cr);
			}
		}
		for (Rent r : rpRent.findAll()) {
			Optional<Bike> bike = rpBike.findById(r.getVehicleId());
			Optional<Scooter> scooter = rpScooter.findById(r.getVehicleId());

			Client cl = rpClient.findById(r.getClientId())
					.orElseThrow(() -> new UserNotFoundException("User doesn't exist!"));
			r.setClient(cl);

			if (bike.isPresent() && !bike.get().getDeleted()) {
				r.setVehicleName(bike.get().getBikeId());
				bikeRentsProcessed.add(r);
			} else if (scooter.isPresent() && !scooter.get().getDeleted()) {
				r.setVehicleName(scooter.get().getScooterId());
				scooterRentsProcessed.add(r);
			}
		}
		Page<Rent> carsPage = filterAndPaginate(carRentsProcessed, query, pageable);
		Page<Rent> bikesPage = filterAndPaginate(bikeRentsProcessed, query, pageable);
		Page<Rent> scootersPage = filterAndPaginate(scooterRentsProcessed, query, pageable);

		Map<String, Page<Rent>> result = new HashMap<>();
		result.put("cars", carsPage);
		result.put("bikes", bikesPage);
		result.put("scooters", scootersPage);

		return result;
	}

	private Page<Rent> filterAndPaginate(List<Rent> rents, String queryInitial,Pageable pageable) {
		Stream<Rent> stream = rents.stream();

		if (queryInitial != null && !queryInitial.trim().isEmpty()) {
			String query = queryInitial.toLowerCase();
			stream = stream.filter(r -> {
				String name = r.getClient().getName().toLowerCase();
				String surname = r.getClient().getSurname().toLowerCase();
				String fullName = name + " " + surname;
				return name.contains(query) || surname.contains(query) || fullName.contains(query)||
						r.getVehicleName().toLowerCase().contains(query);
			});
		}

		List<Rent> filtered = stream.toList();

		int start = (int) pageable.getOffset();
		int end = Math.min(start + pageable.getPageSize(), filtered.size());

		List<Rent> paged = start >= filtered.size() ? Collections.emptyList() : filtered.subList(start, end);
		return new PageImpl<>(paged, pageable, filtered.size());
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
			if(rentCars.size()>0 && !c.getDeleted())
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
			if(rentBikes.size()>0 && !bike.getDeleted())
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
			if(rentScooters.size()>0  && !scooter.getDeleted())
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
