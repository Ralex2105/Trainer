package ru.ralex2105.trainer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.ralex2105.trainer.models.Image;
import ru.ralex2105.trainer.models.Task;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    @Query("select t.image from Task t where t.id = :task_id")
    Optional<Image> getImageByIdTask(@Param("task_id")int task_id);

    @Query("select t from Task t where t.direction.id = :direction and t.participant.id = :participant and t.transport.id = :transport")
    List<Task> findByCategoriesId(@Param("direction")int direction, @Param("participant")int participant, @Param("transport")int transport);

}
