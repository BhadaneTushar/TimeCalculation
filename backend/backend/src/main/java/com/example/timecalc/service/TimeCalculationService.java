package com.example.timecalc.service;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class TimeCalculationService {
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("hh:mm a");
    private static final int EIGHT_HOURS_MINUTES = 8 * 60;

    /**
     * Parses a list of time strings (e.g., ["09:00 AM", "12:00 PM"]) into LocalTime objects.
     * Accepts both lowercase and uppercase AM/PM.
     */
    public List<LocalTime> parseTimes(List<String> timeStrings) {
        List<LocalTime> times = new ArrayList<>();
        for (String s : timeStrings) {
            try {
                times.add(LocalTime.parse(s.trim().toUpperCase(), TIME_FORMAT));
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Invalid time format: " + s + ". Use HH:MM AM/PM.");
            }
        }
        return times;
    }

    /**
     * Calculates total worked minutes from a list of LocalTime (clock-in/clock-out pairs).
     * If odd number of times, adds current time as last clock-out.
     * Ignores negative durations.
     */
    public int calculateTotalWorkedMinutes(List<LocalTime> timeStamps) {
        List<LocalTime> times = new ArrayList<>(timeStamps);
        if (times.size() % 2 != 0) {
            times.add(LocalTime.now());
        }
        int totalMinutesWorked = 0;
        for (int i = 0; i < times.size(); i += 2) {
            Duration duration = Duration.between(times.get(i), times.get(i + 1));
            int minutes = (int) duration.toMinutes();
            if (minutes < 0) {
                continue;
            }
            totalMinutesWorked += minutes;
        }
        return totalMinutesWorked;
    }

    /**
     * Calculates remaining or overtime minutes relative to 8 hours.
     * Positive = remaining, Negative = overtime.
     */
    public int calculateRemainingOrOvertime(int totalWorkedMinutes) {
        return EIGHT_HOURS_MINUTES - totalWorkedMinutes;
    }

    /**
     * Calculates average worked minutes from a list of daily worked minutes.
     */
    public int calculateAverageWorkedMinutes(List<Integer> dailyWorkedMinutes) {
        if (dailyWorkedMinutes == null || dailyWorkedMinutes.isEmpty()) return 0;
        int total = dailyWorkedMinutes.stream().mapToInt(Integer::intValue).sum();
        return total / dailyWorkedMinutes.size();
    }

    /**
     * Formats minutes as HH:mm string.
     */
    public String formatMinutesHHmm(int minutes) {
        int hours = Math.abs(minutes) / 60;
        int mins = Math.abs(minutes) % 60;
        return String.format("%02d:%02d", hours, mins);
    }
} 