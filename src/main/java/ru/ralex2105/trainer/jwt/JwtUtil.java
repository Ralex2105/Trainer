package ru.ralex2105.trainer.jwt;

import io.jsonwebtoken.Claims;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.ralex2105.trainer.models.Role;
import ru.ralex2105.trainer.repository.RoleRepository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class JwtUtil {

    @Autowired
    private RoleRepository repository;


    public JwtAuthentication generate(Claims claims) {
        final JwtAuthentication jwtInfoToken = new JwtAuthentication();
        jwtInfoToken.setRoles(getRoles(claims));
        jwtInfoToken.setFirstName(claims.get("name", String.class));
        jwtInfoToken.setUsername(claims.getSubject());
        return jwtInfoToken;
    }

    private Set<Role> getRoles(Claims claims) {
        final List<LinkedHashMap<String,String>> roles = claims.get("roles", List.class);
         return roles.stream()
                .map(role -> repository.findByName(role.get("authority")))
                .collect(Collectors.toSet());
    }

}