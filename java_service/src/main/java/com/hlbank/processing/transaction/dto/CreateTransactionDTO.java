package com.hlbank.processing.transaction.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.validation.constraints.*;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class CreateTransactionDTO {

    @JsonProperty("uuid")
    @Size(min = 0, max = 25)
    private String uuid;

    @JsonProperty("customer_uid")
    @Size(min = 5, max = 25)
    @NotEmpty
    private String customer_uid;

    @JsonProperty("account_uid")
    @Size(min = 0, max = 25)
    private String account_uid;

    @JsonProperty("type")
    @NotNull
    @Min(0)
    private short type;

    @JsonProperty("amount")
    @Min(0)
    @NotNull
    private Integer amount;

    @JsonProperty("currency")
    @Size(min = 3, max = 3)
    private String currency;

    @JsonProperty("party_currency")
    @Size(min = 3, max = 3)
    private String party_currency;

    @JsonProperty("fx_rate_uid")
    @Size(min = 0, max = 25)
    private String fx_rate_uid;

    @JsonProperty("party_bic")
    @Size(min = 0, max = 14)
    private String party_bic;

    @JsonProperty("party_iban")
    @Size(min = 0, max = 40)
    private String party_iban;

    @JsonProperty("party_account_number")
    @Size(min = 0, max = 30)
    private String party_account_number;

    @JsonProperty("party_sortcode")
    @Size(min = 0, max = 6)
    private String party_sortcode;

    @JsonProperty("party_bank")
    @Size(min = 0, max = 30)
    private String party_bank;

    @JsonProperty("party_bank_country")
    @Size(min = 0, max = 16)
    private String party_bank_country;

    @JsonProperty("party_type")
    private short party_type;

    @JsonProperty("party_name")
    @Size(min = 0, max = 100)
    private String party_name;

    @JsonProperty("party_country")
    @Size(min = 0, max = 16)
    private String party_country;

    @JsonProperty("party_address")
    @Size(min = 0, max = 150)
    private String party_address;

    @JsonProperty("party_zipcode")
    @Size(min = 0, max = 10)
    private String party_zipcode;

    @JsonProperty("party_city")
    @Size(min = 0, max = 30)
    private String party_city;

    @JsonProperty("party_contact")
    @Size(min = 0, max = 100)
    private String party_contact;

    @JsonProperty("party_phone")
    @Size(min = 0, max = 25)
    private String party_phone;

    @JsonProperty("party_email")
    @Size(min = 0, max = 50)
    @Email
    private String party_email;

    @JsonProperty("account_to")
    private Long account_to;

    @JsonProperty("account_from")
    private Long account_from;

    @JsonProperty("provider")
    @Size(min = 0, max = 10)
    @NotEmpty
    private String provider;

    @JsonProperty("description")
    @Size(min = 0, max = 255)
    private String description;
}
