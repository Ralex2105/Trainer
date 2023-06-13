package ru.ralex2105.trainer.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@AllArgsConstructor
@NoArgsConstructor
@Data


@Entity
@Table(name = "answers")
public class Answer implements Serializable {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull(message = "Ответ не может быть пустым")
    @Column(name = "answer")
    private String answer;

    @NotNull(message = "Правильность ответа должна быть введена")
    @Column(name = "is_correct")
    private boolean isCorrect = false;

//    @ManyToOne
//    @JoinColumn(name = "task_id"    )
//    private Task task;
}
