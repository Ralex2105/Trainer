package ru.ralex2105.trainer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.ralex2105.trainer.models.TestTasks;

@Repository
public interface TestTasksRepository extends JpaRepository<TestTasks, Integer> {
    @Modifying
    @Query("delete from TestTasks tt where tt.task.id = :task_id")
    void deleteForTaskId(@Param("task_id")int task_id);
}
