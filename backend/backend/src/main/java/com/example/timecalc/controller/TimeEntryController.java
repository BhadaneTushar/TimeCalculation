package com.example.timecalc.controller;

import com.example.timecalc.dto.*;
import com.example.timecalc.entity.*;
import com.example.timecalc.repository.*;
import com.example.timecalc.service.TimeCalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/entries")
@RequiredArgsConstructor
public class TimeEntryController {
    private final DayEntryRepository dayEntryRepository;
    private final TimeEntryRepository timeEntryRepository;
    private final TimeCalculationService timeCalculationService;

    @PostMapping
    public ResponseEntity<TimeEntrySummaryDTO> submitDayEntry(@RequestBody TimeEntryRequestDTO request) {
        LocalDate date = LocalDate.parse(request.getDate());
        List<LocalTime> times = timeCalculationService.parseTimes(request.getTimes());
        int totalWorked = timeCalculationService.calculateTotalWorkedMinutes(times);
        int remainingOrOvertime = timeCalculationService.calculateRemainingOrOvertime(totalWorked);

        // Save DayEntry and TimeEntries
        DayEntry dayEntry = dayEntryRepository.findByDate(date).orElse(new DayEntry());
        dayEntry.setDate(date);
        dayEntry.setTotalWorkedMinutes(totalWorked);
        dayEntry.setOvertimeMinutes(remainingOrOvertime < 0 ? -remainingOrOvertime : 0);
        // Save time entries
        List<TimeEntry> timeEntryList = new ArrayList<>();
        for (LocalTime t : times) {
            timeEntryList.add(TimeEntry.builder().time(t).dayEntry(dayEntry).build());
        }
        if (dayEntry.getTimeEntries() == null) {
            dayEntry.setTimeEntries(new ArrayList<>());
        } else {
            dayEntry.getTimeEntries().clear();
        }
        dayEntry.getTimeEntries().addAll(timeEntryList);
        dayEntryRepository.save(dayEntry);

        // Calculate average
        List<DayEntry> allDays = dayEntryRepository.findAll();
        List<Integer> allWorked = allDays.stream().map(DayEntry::getTotalWorkedMinutes).collect(Collectors.toList());
        int avg = timeCalculationService.calculateAverageWorkedMinutes(allWorked);
        dayEntry.setAverageWorkedMinutes(avg);
        dayEntryRepository.save(dayEntry);

        // Prepare response
        TimeEntrySummaryDTO dto = new TimeEntrySummaryDTO();
        dto.setDate(date.toString());
        dto.setTimes(request.getTimes());
        dto.setTotalWorked(timeCalculationService.formatMinutesHHmm(totalWorked));
        dto.setRemainingOrOvertime(timeCalculationService.formatMinutesHHmm(remainingOrOvertime));
        dto.setOvertime(remainingOrOvertime < 0);
        dto.setAverageWorked(timeCalculationService.formatMinutesHHmm(avg));
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{day}")
    public ResponseEntity<TimeEntrySummaryDTO> getDaySummary(@PathVariable("day") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String day) {
        LocalDate date = LocalDate.parse(day);
        DayEntry dayEntry = dayEntryRepository.findByDate(date).orElse(null);
        if (dayEntry == null) return ResponseEntity.notFound().build();
        List<String> times = dayEntry.getTimeEntries().stream().map(te -> te.getTime().format(DateTimeFormatter.ofPattern("hh:mm a"))).collect(Collectors.toList());
        int remainingOrOvertime = timeCalculationService.calculateRemainingOrOvertime(dayEntry.getTotalWorkedMinutes());
        TimeEntrySummaryDTO dto = new TimeEntrySummaryDTO();
        dto.setDate(dayEntry.getDate().toString());
        dto.setTimes(times);
        dto.setTotalWorked(timeCalculationService.formatMinutesHHmm(dayEntry.getTotalWorkedMinutes()));
        dto.setRemainingOrOvertime(timeCalculationService.formatMinutesHHmm(remainingOrOvertime));
        dto.setOvertime(remainingOrOvertime < 0);
        dto.setAverageWorked(timeCalculationService.formatMinutesHHmm(dayEntry.getAverageWorkedMinutes()));
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<DayEntryListDTO>> listAllDays() {
        List<DayEntry> allDays = dayEntryRepository.findAll();
        int avg = timeCalculationService.calculateAverageWorkedMinutes(
                allDays.stream().map(DayEntry::getTotalWorkedMinutes).collect(Collectors.toList())
        );
        List<DayEntryListDTO> result = allDays.stream().map(day -> {
            DayEntryListDTO dto = new DayEntryListDTO();
            dto.setDate(day.getDate().toString());
            dto.setTotalWorked(timeCalculationService.formatMinutesHHmm(day.getTotalWorkedMinutes()));
            dto.setOvertime(day.getTotalWorkedMinutes() > 8 * 60);
            dto.setAverageWorked(timeCalculationService.formatMinutesHHmm(avg));
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @DeleteMapping
    public ResponseEntity<Void> clearAllEntries() {
        timeEntryRepository.deleteAll();
        dayEntryRepository.deleteAll();
        return ResponseEntity.noContent().build();
    }
} 