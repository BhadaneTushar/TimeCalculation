package com.example.timecalc.repository;

import com.example.timecalc.entity.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {
} 