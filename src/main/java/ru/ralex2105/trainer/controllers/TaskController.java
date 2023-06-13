package ru.ralex2105.trainer.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ralex2105.trainer.models.Answer;
import ru.ralex2105.trainer.services.TaskService;
import ru.ralex2105.trainer.exceptions.ValidationException;
import ru.ralex2105.trainer.image.ImageUtil;
import ru.ralex2105.trainer.models.Task;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin
@RequestMapping("/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> getTasks() {
        final List<Task> tasks = taskService.readAll();
        if (tasks == null || tasks.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        tasks.forEach(task -> ImageUtil.decompressImage(task.getImage()));
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> read(@PathVariable(name = "id") int id) {
        final Task obj = taskService.read(id);

        if (obj != null) {
            ImageUtil.decompressImage(obj.getImage());
            return new ResponseEntity<>(obj, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<?> readImage(@PathVariable(name = "id") int id) {
        try {
            final byte[] obj = taskService.getImageFromTaskById(id);

            return obj != null
                    ? ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.valueOf("image/png"))
                    .body(obj)
                    : new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @GetMapping("/answers/{id}")
    public ResponseEntity<Set<Answer>> answers(@PathVariable(name = "id") int id) {
        final Task task = taskService.read(id);
        return task != null
                ? new ResponseEntity<>(task.getAnswers(), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    //    @PostMapping
//    public ResponseEntity<?> create(@RequestBody Task task, @RequestParam("imageFile") MultipartFile file) throws IOException {
//        taskService.createWithImage(task, file);
//        return new ResponseEntity<>(HttpStatus.CREATED);
//    }
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Task task) throws IOException {
        try {
            taskService.create(task);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (ValidationException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getReason());
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable(name = "id") int id, @RequestBody Task task) {
        final boolean updated = taskService.update(task, id);

        return updated
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") int id) {
        final boolean deleted = taskService.delete(id);

        return deleted
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }
}
