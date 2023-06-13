package ru.ralex2105.trainer.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.time.Instant;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@AllArgsConstructor
@NoArgsConstructor
@Data

@Entity
@Table(name = "tests")
public class Test implements Serializable {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @NotNull
    @Column(name = "date")
    private Date date = Date.from(Instant.now());

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "test_id")
    private Set<TestTasks> tasks = new HashSet<>();

    @Column(name = "is_complete")
    boolean isComplete;

}
