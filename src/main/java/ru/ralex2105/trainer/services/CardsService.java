package ru.ralex2105.trainer.services;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.ralex2105.trainer.models.Card;
import ru.ralex2105.trainer.repository.CardRepository;
import ru.ralex2105.trainer.exceptions.ValidationException;

@Slf4j
@Service
public class CardsService extends DBService<Card, CardRepository>{

    @Transactional
    @Override
    public boolean create(Card obj) {
        validateCard(obj);
        return super.create(obj);
    }

    @Override
    public boolean update(Card obj, int id) {
        final boolean updated = super.update(obj, id);
        if (updated)
        {
            obj.setId(id);
            repository.save(obj);
        }
        return updated;
    }

    @ResponseBody
    public void validateCard(Card obj) {
        if (obj.getDescription().length() < 5 || obj.getDescription().length() > 250) {
            log.warn("Описание не может быть пустым или иметь размер меньше 5 и больше 250");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Неверно указано описание");
        } else if (obj.getImage() == null) {
            log.warn("Изображение не может быть пустое");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Изображение должно быть введено");
        }
    }
}
