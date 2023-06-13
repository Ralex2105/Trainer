package ru.ralex2105.trainer.services;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.ralex2105.trainer.config.CategoryType;
import ru.ralex2105.trainer.exceptions.ValidationException;
import ru.ralex2105.trainer.models.Marker;
import ru.ralex2105.trainer.repository.MarkerRepository;

@Slf4j
@Service
public class MarkerService extends DBService<Marker, MarkerRepository> {

    @Transactional
    @Override
    public boolean create(Marker obj) {
        validateMarker(obj);
        return super.create(obj);
    }

    @Override
    public boolean update(Marker obj, int id) {
        final boolean updated = super.update(obj, id);
        if (updated)
        {
            obj.setId(id);
            repository.save(obj);
        }
        return updated;
    }

    @ResponseBody
    public void validateMarker(Marker obj) {
        if (obj.getTransport().getType() != CategoryType.Transport) {
            log.warn("Категория транспорта должно быть транспортом");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Неверно указан транспорт");
        } else if (obj.getDescription().length() < 5 || obj.getDescription().length() > 250) {
            log.warn("Описание не может быть пустым или иметь размер меньше 5 и больше 250");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Неверно указано описание");
        } else if (obj.getName().length() < 5 || obj.getName().length() > 250) {
            log.warn("Название не может быть пустым или иметь размер меньше 5 и больше 250");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Неверно указано название");
        }
    }
}
