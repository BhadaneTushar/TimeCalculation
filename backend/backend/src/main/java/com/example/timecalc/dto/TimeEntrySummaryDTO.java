package com.example.timecalc.dto;

import lombok.Data;
import java.util.List;

@Data
public class TimeEntrySummaryDTO {
    private String date;
    private List<String> times;
    private String totalWorked;
    private String remainingOrOvertime;
    private boolean overtime;
    private String averageWorked;
} 