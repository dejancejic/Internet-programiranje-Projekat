package server.statistics;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import server.malfunction.Malfunction;
import server.malfunction.MalfunctionRepository;
import server.rent.Rent;
import server.rent.RentRepository;
import server.vehicle.bike.Bike;
import server.vehicle.bike.BikeRepository;
import server.vehicle.car.Car;
import server.vehicle.car.CarRepository;
import server.vehicle.scooter.Scooter;
import server.vehicle.scooter.ScooterRepository;

@Service
public class StatisticsService {

	@Autowired
	private RentRepository rpRent;
	
	@Autowired
	private CarRepository rpCar;
	
	@Autowired
	private BikeRepository rpBike;
	
	@Autowired
	private ScooterRepository rpScooter;
	
	@Autowired
	private MalfunctionRepository rpMalfunction;
	
	
	
	
	public HashMap<Integer, List<RevenueModel>> getMonthlyRevenue()
	{
		HashMap<Integer, List<RevenueModel>> map=new HashMap<Integer, List<RevenueModel>>();
		
		List<Rent> allRents=rpRent.findAll();
		
		for(int i=1;i<=12;i++)
		{
			List<RevenueModel> list=new ArrayList<RevenueModel>();
			for(int j=1;j<=29;j++)
			{
				list.add(new RevenueModel(j+"", 0.0));
			}
			if(i!=2) {
				list.add(new RevenueModel("30", 0.0));
				
			if(i==1 || i==3 || i==5 || i==7 || i==8 || i==10 || i==12)
			{
				list.add(new RevenueModel("31", 0.0));
			}
			
			}
			map.put(i, list);
		}
		
		for(Rent r:allRents)
		{
			Optional<Car> car= rpCar.findById(r.getVehicleId());
			Optional<Bike> bike= rpBike.findById(r.getVehicleId());
			Optional<Scooter> scooter= rpScooter.findById(r.getVehicleId());
			
			int day=r.getDateTime().getDayOfMonth();
			int month=r.getDateTime().getMonthValue();
			List<RevenueModel> list=map.get(month);
			Double price=list.get(day).getValue();
			
			long durationDays = ChronoUnit.DAYS.between(r.getDateTime(), r.getDuration());
			long durationMinutes=ChronoUnit.MINUTES.between(r.getDateTime(), r.getDuration());
			
			if(car.isPresent())
			{
				list.get(day).setValue(price+car.get().getPrice()*durationDays);	
			}
			else if(bike.isPresent())
			{
				list.get(day).setValue(price+bike.get().getPrice()*durationMinutes);
			}
			else if(scooter.isPresent()) {
				list.get(day).setValue(price+scooter.get().getPrice()*durationMinutes);
			}
			
			map.put(month, list);
		}
		
		return map;
	}
	
	
	public List<RevenueModel> getRevenueByVehicle()
	{

		List<RevenueModel> list=new ArrayList<>();
		list.add(new RevenueModel("E-Car", 0.0));
		list.add(new RevenueModel("E-Bike", 0.0));
		list.add(new RevenueModel("E-Scooter", 0.0));
		
		List<Rent> allRents=rpRent.findAll();
		
		for(Rent r:allRents)
		{
			Optional<Car> car= rpCar.findById(r.getVehicleId());
			Optional<Bike> bike= rpBike.findById(r.getVehicleId());
			Optional<Scooter> scooter= rpScooter.findById(r.getVehicleId());
			
			int day=r.getDateTime().getDayOfMonth();
			int month=r.getDateTime().getMonthValue();
			
			long durationDays = ChronoUnit.DAYS.between(r.getDateTime(), r.getDuration());
			long durationMinutes=ChronoUnit.MINUTES.between(r.getDateTime(), r.getDuration());
			
			if(car.isPresent())
			{
				list.get(0).setValue(list.get(0).getValue()+car.get().getPrice()*durationDays);	
			}
			else if(bike.isPresent())
			{
				list.get(1).setValue(list.get(1).getValue()+bike.get().getPrice()*durationMinutes);	
			}
			else if(scooter.isPresent()) {
				list.get(2).setValue(list.get(2).getValue()+scooter.get().getPrice()*durationMinutes);	
			}
			
		}
		
		return list;
	}
	
	public List<MalfunctionTotalModel> getTotalMalfunctionsPerVehicle()
	{
		List<MalfunctionTotalModel> list=new ArrayList<MalfunctionTotalModel>();
		
		list.add(new MalfunctionTotalModel("E-Car", new ArrayList<RevenueModel>()));
		list.add(new MalfunctionTotalModel("E-Bike", new ArrayList<RevenueModel>()));
		list.add(new MalfunctionTotalModel("E-Scooter", new ArrayList<RevenueModel>()));
		
		List<Car> cars=rpCar.findAll();
		
		for(Car c:cars)
		{
			List<Malfunction> mals=rpMalfunction.findByVehicleId(c.getId());
			List<RevenueModel> series=list.get(0).getSeries();
			series.add(new RevenueModel(c.getCarId(),(double)mals.size()));
			
		}
		
		List<Bike> bikes=rpBike.findAll();
		
		for(Bike b:bikes)
		{
			List<Malfunction> mals=rpMalfunction.findByVehicleId(b.getId());
			List<RevenueModel> series=list.get(1).getSeries();
			series.add(new RevenueModel(b.getBikeId(),(double)mals.size()));
		}
		
		List<Scooter> scooters=rpScooter.findAll();
		
		for(Scooter s:scooters)
		{
			List<Malfunction> mals=rpMalfunction.findByVehicleId(s.getId());
			List<RevenueModel> series=list.get(2).getSeries();
			series.add(new RevenueModel(s.getScooterId(),(double)mals.size()));
		}
		
		
		
		return list;
	}


}
