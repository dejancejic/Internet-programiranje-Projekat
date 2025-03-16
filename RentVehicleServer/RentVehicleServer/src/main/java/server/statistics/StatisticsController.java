package server.statistics;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {

	@Autowired
	private StatisticsService service;
	
	@GetMapping("/month/revenue")
	public ResponseEntity<HashMap<Integer, List<RevenueModel>>> getMonthlyRevenue()
	{
		return new ResponseEntity<HashMap<Integer, List<RevenueModel>>>(service.getMonthlyRevenue(),HttpStatus.OK);
	}
	
	@GetMapping("/vehicle")
	public ResponseEntity<List<RevenueModel>> getRevenueByVehicle()
	{
		return new ResponseEntity<List<RevenueModel>>(service.getRevenueByVehicle(),HttpStatus.OK);
	}
	
	@GetMapping("/malfunctions/total")
	public ResponseEntity<List<MalfunctionTotalModel>> getTotalMalfunctionsPerVehicle()
	{
		return new ResponseEntity<List<MalfunctionTotalModel>>(service.getTotalMalfunctionsPerVehicle(),HttpStatus.OK);
	}

}
