package server.promotions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PromotionService {

	@Autowired
	private PromotionRepository rpPromotion;
	
	
	public Promotion addPromotion(Promotion promotion)
	{
		promotion=rpPromotion.save(promotion);
		return promotion;
	}

}
