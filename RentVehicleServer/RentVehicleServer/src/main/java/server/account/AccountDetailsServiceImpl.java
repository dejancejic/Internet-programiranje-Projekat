package server.account;


import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AccountDetailsServiceImpl implements UserDetailsService{

	private final AccountRepository rp;
	
	public AccountDetailsServiceImpl(AccountRepository rp) {
		this.rp = rp;
	}



	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		return rp.findByusername(username).orElseThrow(()->new UsernameNotFoundException("Account with that username doesn't exist!"));
	}

}
