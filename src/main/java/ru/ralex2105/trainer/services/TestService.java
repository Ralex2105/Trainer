package ru.ralex2105.trainer.services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ru.ralex2105.trainer.image.ImageUtil;
import ru.ralex2105.trainer.models.Task;
import ru.ralex2105.trainer.models.Test;
import ru.ralex2105.trainer.models.TestTasks;
import ru.ralex2105.trainer.models.User;
import ru.ralex2105.trainer.repository.TaskRepository;
import ru.ralex2105.trainer.repository.TestRepository;
import ru.ralex2105.trainer.repository.TestTasksRepository;
import ru.ralex2105.trainer.exceptions.ValidationException;
import ru.shoichi.trainer.models.*;

import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Service
public class TestService extends DBService<Test, TestRepository> {

    @Autowired
    TaskRepository taskRepository;
    @Autowired
    TestTasksRepository testTasksRepository;
    @Autowired
    AnswerService answerService;

    @Autowired
    UserService service;

    @Transactional
    public List<Test> readAllForUser(int id) {
        return repository.findForUser(id);
    }

    @Transactional
    public Test readNonCompleteForUser(int id) {
        return repository.findNonCompleteForUser(id).stream().findFirst().orElse(null);
    }

    @Transactional
    public boolean deleteForAllTask(int taskId) {
        testTasksRepository.deleteForTaskId(taskId);
        return true;
    }

    @Transactional
    public Test generateTest(int num, int direction, int participant, int transport, String email) throws ValidationException {
        User user = service.findByEmail(email);
        List<Task> tasks = taskRepository.findByCategoriesId(direction, participant, transport);
        if (tasks.size() < num) {
            throw new ValidationException(HttpStatus.BAD_REQUEST,
                    "Заданий меньше, чем нужно для генерации теста." + " Всего заданий в категории: " + tasks.size());
        }
        Random random = new Random();
        Test test = new Test();

        Set<Task> testTasks = new HashSet<>();
        for (int i = 0; i < num; i++) {
            int taskId = random.nextInt(num);
            while (testTasks.contains(tasks.get(taskId))) {
                taskId = random.nextInt(num);
            }
            testTasks.add(tasks.get(taskId));
        }
        for (Task task : testTasks) {
            TestTasks testTask = new TestTasks();
            testTask.setTask(task);
            test.getTasks().add(testTask);
        }
        test.setUser(user);
        repository.save(test);
        return test;
    }

    public boolean update(Test obj, int id, String email) {
        final boolean updated = super.update(obj, id);
        User user = service.findByEmail(email);

        if (updated && user != null) {

            obj.getTasks().stream()
                    .map(TestTasks::getTask).forEach(task -> ImageUtil.compressImage(task.getImage()));
            obj.getTasks()
                    .stream()
                    .filter(testTasks -> testTasks.getTask().isTyped())
                    .forEach(testTasks ->
                            testTasks.setAnswer(testTasks
                                    .getTask()
                                    .getAnswers()
                                    .stream()
                                    .filter(answer -> answer
                                            .getAnswer()
                                            .equalsIgnoreCase(testTasks.getAnswer().getAnswer()))
                                    .findFirst()
                                    .orElse(null)));
            obj.setUser(user);
            repository.save(obj);
        }
        return updated && user != null;
    }

}
