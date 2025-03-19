package server.post;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import server.exceptions.UserNotFoundException;

@Service
public class PostService {

	@Autowired
	private PostRepository rpPost;
	
	public Post addPost(Post post)
	{
		post=rpPost.save(post);
		return post;
	}

	public Post getPostById(Integer id) {
		Optional<Post> post=rpPost.findById(id);
		
		if(post.isPresent())
		return post.get();
		
		throw new UserNotFoundException("Post with that id doesn't exist!");
	}

}
