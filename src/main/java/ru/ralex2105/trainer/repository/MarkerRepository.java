package ru.ralex2105.trainer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.ralex2105.trainer.models.Marker;

@Repository
public interface MarkerRepository extends JpaRepository<Marker, Integer> {
}
