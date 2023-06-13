package ru.ralex2105.trainer.services;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.ralex2105.trainer.models.Role;
import ru.ralex2105.trainer.repository.UserRepository;
import ru.ralex2105.trainer.models.User;

import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService extends DBService<User, UserRepository> implements UserDetailsService {
    @PersistenceContext
    private EntityManager em;


    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    @Lazy
    public void setPasswordEncoder(BCryptPasswordEncoder passwordEncoder)
    {
        bCryptPasswordEncoder = passwordEncoder;
    }

    @Transactional
    public User findByEmail(String email) {
        return this.repository.findByEmail(email);
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = repository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return user;
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<Role> roles)
    {
        return roles.stream().map(r -> new SimpleGrantedAuthority(r.getName())).collect(Collectors.toList());
    }

    @Override
    public boolean create(User obj)
    {
        User userFromDB = repository.findByEmail(obj.getEmail());

        if (userFromDB != null) {
            return false;
        }
        obj.setEnabled(true);
        obj.setRole(new Role(3, "student"));
        obj.setPassword(bCryptPasswordEncoder.encode(obj.getPassword()));
        repository.save(obj);
        return true;
    }

    public boolean updateRole(int id, Role role) {
        Optional<User> optional = repository.findById(id);
        if(optional.isPresent()){
            User user = optional.get();
            user.setRole(role);
            repository.save(user);
            return true;
        }

        return false;
    }

    @Override
    public boolean update(User obj, int id) {
        Optional<User> user = repository.findById(id);
        if (user.isPresent())
        {
            if(!user.get().getPassword().equals(obj.getPassword()))
            {
                obj.setPassword(bCryptPasswordEncoder.encode(obj.getPassword()));
            }
            obj.setId(id);
            repository.save(obj);
        }
        return user.isPresent();
    }
}
