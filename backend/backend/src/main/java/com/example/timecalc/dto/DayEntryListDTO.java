package com.example.timecalc.dto;

import lombok.Data;

@Data
public class DayEntryListDTO {
    private String date;
    private String totalWorked;
    private boolean overtime;
    private String averageWorked;
} 