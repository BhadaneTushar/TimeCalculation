package com.example.timecalc.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DayEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    @OneToMany(mappedBy = "dayEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TimeEntry> timeEntries;

    private int totalWorkedMinutes;
    private int averageWorkedMinutes;
    private int overtimeMinutes;
} 