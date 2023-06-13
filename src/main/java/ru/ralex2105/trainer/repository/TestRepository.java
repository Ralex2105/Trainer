package ru.ralex2105.trainer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.ralex2105.trainer.models.Test;

import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, Integer> {
    @Query("select t from Test t where t.user.id = :user_id and t.isComplete = true")
    List<Test> findForUser(@Param("user_id")int user_id);

    @Query("select t from Test t where t.user.id = :user_id and t.isComplete = false")
    List<Test> findNonCompleteForUser(@Param("user_id")int user_id);
}
