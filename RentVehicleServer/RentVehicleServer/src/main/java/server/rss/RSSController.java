package server.rss;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/rss")
public class RSSController {

	@Autowired
	private RSSService service;

	@GetMapping(produces = MediaType.APPLICATION_XML_VALUE)
	public String gerRSSFeed()
	{
		return service.getRssFeed();
	}
	

}
