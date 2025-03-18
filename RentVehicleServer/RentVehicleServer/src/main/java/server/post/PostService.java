package server.post;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostService {

	@Autowired
	private PostRepository rpPost;
	
	public Post addPost(Post post)
	{
		post=rpPost.save(post);
		return post;
	}

}
