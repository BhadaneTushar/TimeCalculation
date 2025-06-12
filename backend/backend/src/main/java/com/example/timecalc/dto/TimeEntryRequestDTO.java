package com.example.timecalc.dto;

import lombok.Data;
import java.util.List;

@Data
public class TimeEntryRequestDTO {
    private String date; // yyyy-MM-dd
    private List<String> times; // ["09:00 AM", "12:00 PM", ...]
} 