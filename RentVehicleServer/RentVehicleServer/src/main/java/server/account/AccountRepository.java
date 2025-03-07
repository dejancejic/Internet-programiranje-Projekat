package server.account;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



public interface AccountRepository extends JpaRepository<Account, Integer>{
	public Optional<Account> findByusername(String username);
}
