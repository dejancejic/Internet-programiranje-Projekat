package server.promotions;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import server.exceptions.UserNotFoundException;

@Service
public class PromotionService {

	@Autowired
	private PromotionRepository rpPromotion;
	
	
	public Promotion addPromotion(Promotion promotion)
	{
		promotion=rpPromotion.save(promotion);
		return promotion;
	}
	
	
	public Promotion getPromotionById(Integer id) {
		Optional<Promotion> prom=rpPromotion.findById(id);
		
		if(prom.isPresent())
		return prom.get();
		
		throw new UserNotFoundException("Promotion with that id doesn't exist!");
	}

}
