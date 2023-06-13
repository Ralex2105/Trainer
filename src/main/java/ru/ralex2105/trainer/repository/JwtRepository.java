package ru.ralex2105.trainer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ralex2105.trainer.models.JwtToken;

public interface JwtRepository extends JpaRepository<JwtToken, Integer> {
    JwtToken findByEmail(String email);
}
