package ru.ralex2105.trainer.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.ralex2105.trainer.repository.AnswerRepository;
import ru.ralex2105.trainer.models.Answer;

@Slf4j
@Service
public class AnswerService extends DBService<Answer, AnswerRepository> {



    @Override
    public boolean update(Answer obj, int id) {
        final boolean updated = super.update(obj, id);
        if (updated)
        {
            obj.setId(id);
            repository.save(obj);
        }
        return updated;
    }
}
