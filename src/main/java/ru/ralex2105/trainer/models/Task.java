package ru.ralex2105.trainer.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.util.Set;

@Slf4j
@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "tasks")
public class Task implements Serializable {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull(message = "Описание не может быть пустым")
    @Column(name = "description")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoryDirection_id")
    private Category direction;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoryParticipant_id")
    private Category participant;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoryTransport_id")
    private Category transport;

    @Column(name = "link")
    private String link;

    @Column(name = "is_typed")
    private boolean isTyped;


    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "image_id")
    private Image image;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "task_id")
    private Set<Answer> answers;




}
