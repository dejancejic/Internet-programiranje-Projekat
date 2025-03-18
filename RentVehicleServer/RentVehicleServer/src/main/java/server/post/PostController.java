package server.post;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/post")
public class PostController {

	@Autowired
	private PostService service;
	
	@PostMapping("/add")
	public ResponseEntity<Post> addPost(@RequestBody Post post)
	{
		return new ResponseEntity<Post>(service.addPost(post),HttpStatus.OK);
	}
	
	
}
