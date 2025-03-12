package server.rent;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import server.client.Client;
import server.client.ClientRepository;
import server.exceptions.UserNotFoundException;

@Service
public class RentService {

	@Autowired
	private RentRepository rpRent;
	
	@Autowired
	private ClientRepository rpClient;
	
	public List<Rent> getVehicleRents(Integer idVehicle)
	{
		List<Rent> rents=rpRent.findByVehicleId(idVehicle);
		
		for(Rent r:rents)
		{
			Client cl=rpClient.findById(r.getClientId()).orElseThrow(()->new UserNotFoundException("User doesn't exist!"));
			r.setClientName(cl.getName()+" "+cl.getSurname());
		}
		return rents;
	}
	

}
