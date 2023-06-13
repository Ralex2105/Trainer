package ru.ralex2105.trainer.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.ralex2105.trainer.exceptions.ValidationException;
import ru.ralex2105.trainer.image.ImageUtil;
import ru.ralex2105.trainer.models.Test;
import ru.ralex2105.trainer.models.TestTasks;
import ru.ralex2105.trainer.services.TestService;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/tests")
public class TestController {

    @Autowired
    private TestService service;

    @GetMapping
    public ResponseEntity<List<Test>> getTests() {
        final List<Test> tasks = service.readAll();
        return tasks != null && !tasks.isEmpty()
                ? new ResponseEntity<>(tasks, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Test>> getTestForUser(@PathVariable(name = "id") int id) {
        final List<Test> tests = service.readAllForUser(id);
        if (tests == null || tests.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        tests.stream()
                .flatMap(test -> test.getTasks().stream())
                .map(TestTasks::getTask).collect(Collectors.toSet())
                .forEach(task -> ImageUtil.decompressImage(task.getImage()));
        return new ResponseEntity<>(tests, HttpStatus.OK);
    }

    @GetMapping("/noncomplete/user/{id}")
    public ResponseEntity<?> getNonCompleteTestForUser(@PathVariable(name = "id") int id) {
        final Test tests = service.readNonCompleteForUser(id);
        if (tests == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        tests.getTasks().stream()
                .map(TestTasks::getTask).collect(Collectors.toSet())
                .forEach(task -> ImageUtil.decompressImage(task.getImage()));
        return new ResponseEntity<>(tests, HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Test> read(@PathVariable(name = "id") int id) {
        final Test obj = service.read(id);

        return obj != null
                ? new ResponseEntity<>(obj, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Test answer) {
        service.create(answer);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateTest(@RequestParam("nums") int nums, @RequestParam("direction") int direction,
                                          @RequestParam("participant") int participant,
                                          @RequestParam("transport") int transport) {
        String user = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            Test test = service.generateTest(nums, direction, participant, transport, user);
            test.getTasks().forEach(testTasks1 -> ImageUtil.decompressImage(testTasks1.getTask().getImage()));
            return new ResponseEntity<>(test, HttpStatus.OK);
        } catch (ValidationException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getReason());
        } catch (Exception exception) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable(name = "id") int id, @RequestBody Test test) {
        String user = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final boolean updated = service.update(test, id, user);

        return updated
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

    @DeleteMapping("/task/{id}")
    public ResponseEntity<?> deleteTasksForTest(@PathVariable(name = "id") int id) {
        final boolean deleted = service.deleteForAllTask(id);
        return deleted
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") int id) {
        final boolean deleted = service.delete(id);

        return deleted
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }
}
