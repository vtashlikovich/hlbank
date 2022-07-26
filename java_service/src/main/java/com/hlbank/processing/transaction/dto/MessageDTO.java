package com.hlbank.processing.transaction.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class MessageDTO {
    @JsonProperty("pattern")
    private String pattern = "create-tx";

    @JsonProperty("data")
    private CreateTransactionDTO data;
}
