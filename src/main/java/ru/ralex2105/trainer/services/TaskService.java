package ru.ralex2105.trainer.services;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import ru.ralex2105.trainer.repository.TaskRepository;
import ru.ralex2105.trainer.config.CategoryType;
import ru.ralex2105.trainer.exceptions.ValidationException;
import ru.ralex2105.trainer.models.Image;
import ru.ralex2105.trainer.models.Task;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class TaskService extends DBService<Task, TaskRepository> {
    @Autowired
    AnswerService answerService;
    @Autowired
    ImageService imageService;

    public byte[] getImageFromTaskById(int id) {
        Optional<Task> task = repository.findById(id);
        if (task.isEmpty()) {
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Задания с таким id нет");
        }
        return imageService.getImageById(task.get().getImage().getId()).getImageData();
    }

    public List<Task> readByCategory(int direction, int participant, int transport) {
        return repository.findByCategoriesId(direction, participant, transport);
    }


    @Override
    public Task read(int id) {
        return super.read(id);
    }

    @Transactional
    @Override
    public boolean create(Task obj) {
        validateTask(obj);
        return super.create(obj);
    }

    @Override
    public boolean delete(int id) {
        Task task = repository.findById(id).orElse(null);
        if (task != null) {
            repository.delete(task);
            return true;
        }
        return false;
    }

    public boolean createWithImage(Task obj, MultipartFile file) throws IOException {
        if (file == null) {
            log.warn("Изображение не может быть пустое");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Изображение должно быть введено");
        }
        imageService.uploadImage(file);
        Image image = imageService.getInfoByImageByName(file.getOriginalFilename());
        obj.setImage(image);
        validateTask(obj);
        return super.create(obj);
    }

    @Transactional
    @Override
    public boolean update(Task obj, int id) {
        final boolean updated = super.update(obj, id);
        if (updated) {
            obj.setId(id);
            repository.save(obj);
        }
        return updated;
    }

    @ResponseBody
    public void validateTask(Task obj) {
        if (obj.getDirection().getType() != CategoryType.Direction) {
            log.warn("Категория направления должно быть направлением");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Неверно указано направление");
        } else if (obj.getParticipant().getType() != CategoryType.Participant) {
            log.warn("Категория участника должно быть участником");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Неверно указан участник");
        } else if (obj.getTransport().getType() != CategoryType.Transport) {
            log.warn("Категория транспорта должно быть транспортом");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Неверно указан транспорт");
        } else if (obj.getDescription().length() < 5 || obj.getDescription().length() > 250) {
            log.warn("Описание не может быть пустым или иметь размер меньше 5 и больше 250");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Неверно указано описание");
        } else if (obj.getImage() == null) {
            log.warn("Изображение не может быть пустое");
            throw new ValidationException(HttpStatus.BAD_REQUEST, "Изображение должно быть введено");
        }
    }
}
