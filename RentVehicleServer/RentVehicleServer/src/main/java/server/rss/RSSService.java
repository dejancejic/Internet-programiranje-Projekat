package server.rss;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import server.post.Post;
import server.post.PostRepository;
import server.promotions.Promotion;
import server.promotions.PromotionRepository;

@Service
public class RSSService {

	@Autowired
	private PostRepository rpPost;
	
	@Autowired
	private PromotionRepository rpPromotion;
	
	
	public String getRssFeed() {
        List<Post> posts = rpPost.findAll();
        List<Promotion> promotions = rpPromotion.findAll();

        StringBuilder rssFeed = new StringBuilder();
        rssFeed.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        rssFeed.append("<rss version=\"2.0\">\n");
        rssFeed.append("<channel>\n");
        rssFeed.append("<title>Promotions and Posts Feed</title>\n");
        rssFeed.append("<link>https://localhost:8443/rss</link>\n");
        rssFeed.append("<description>Latest promotions and posts</description>\n");

        
        for (Post post : posts) {
            rssFeed.append("<item>\n");
            rssFeed.append("<title>").append(escapeXml(post.getTitle())).append("</title>\n");
            rssFeed.append("<link>http://localhost:8443/post/").append(post.getId()).append("</link>\n");
            rssFeed.append("<description>").append(escapeXml(post.getContent())).append("</description>\n");
            rssFeed.append("</item>\n");
        }

        
        for (Promotion promotion : promotions) {
            rssFeed.append("<item>\n");
            rssFeed.append("<title>").append(escapeXml("Promotion: " + promotion.getTitle())).append("</title>\n");
            rssFeed.append("<link>http://localhost:8443/promotion/").append(promotion.getId()).append("</link>\n");
            rssFeed.append("<description>").append(escapeXml(promotion.getDescription())).append("</description>\n");
            rssFeed.append("</item>\n");
        }

        rssFeed.append("</channel>\n");
        rssFeed.append("</rss>");

        return rssFeed.toString();
    }

    private String escapeXml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                    .replace("\"", "&quot;")
                    .replace("'", "&apos;");
    }

}
