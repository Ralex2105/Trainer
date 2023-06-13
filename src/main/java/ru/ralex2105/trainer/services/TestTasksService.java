package ru.ralex2105.trainer.services;

import org.springframework.stereotype.Service;
import ru.ralex2105.trainer.repository.TestTasksRepository;
import ru.ralex2105.trainer.models.TestTasks;

@Service
public class TestTasksService extends DBService<TestTasks, TestTasksRepository> {
    @Override
    public boolean update(TestTasks obj, int id) {
        final boolean updated = super.update(obj, id);
        if (updated)
        {
            obj.setId(id);
            repository.save(obj);
        }
        return updated;
    }
}
