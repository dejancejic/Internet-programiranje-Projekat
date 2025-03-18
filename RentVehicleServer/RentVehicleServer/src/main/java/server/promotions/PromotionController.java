package server.promotions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/promotions")
public class PromotionController {

	@Autowired
	private PromotionService service;
	
	
	@PostMapping("/add")
	public ResponseEntity<Promotion> addPromotion(@RequestBody Promotion promotion)
	{
		return new ResponseEntity<Promotion>(service.addPromotion(promotion),HttpStatus.OK);
	}

}
