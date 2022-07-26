package com.hlbank.processing.transaction.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name="hlb_transaction", schema = "PUBLIC")
@TypeDef(
        name = "enum_currency",
        typeClass = CurrencyEnumType.class
)
public class Transaction {
    @Id
    @SequenceGenerator(name = "hlb_transaction_id_seq",
            sequenceName = "hlb_transaction_id_seq",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "hlb_transaction_id_seq")
    private Long id;

    @Column(columnDefinition = "varchar(34)", unique = true)
    private String uuid;

    @Column(columnDefinition = "varchar(25)", nullable = false)
    private String customer_uid;

    @Column(columnDefinition = "varchar(25)", nullable = false)
    private String account_uid;

    @Column(columnDefinition = "SMALLINT", nullable = false)
    private short type;

    @Column(columnDefinition = "INTEGER default 1", nullable = false)
    private int status;

    @Column(nullable = false)
    private Integer amount;

    @Column(columnDefinition = "varchar(3)", nullable = true)
    private String currency;

    @Column(nullable = true)
    private Integer fee;

    @Column(columnDefinition = "integer default 0")
    private Integer party_amount;

    @Column(columnDefinition = "varchar(3)", nullable = true)
    private String party_currency;

    @Column(columnDefinition = "varchar(25)", nullable = true)
    private String fx_rate_uid;

    @Column(nullable = true)
    private Integer fx_rate;

    @Column(columnDefinition = "varchar(14)")
    private String party_bic;

    @Column(columnDefinition = "varchar(40)")
    private String party_iban;

    @Column(columnDefinition = "varchar(30)")
    private String party_account_number;

    @Column(columnDefinition = "varchar(6)")
    private String party_sortcode;

    @Column(columnDefinition = "varchar(30)")
    private String party_bank;

    @Column(columnDefinition = "varchar(16)")
    private String party_bank_country;

    @Column(columnDefinition = "SMALLINT")
    private short party_type;

    @Column(columnDefinition = "varchar(100)")
    private String party_name;

    @Column(columnDefinition = "varchar(16)")
    private String party_country;

    @Column(columnDefinition = "varchar(150)")
    private String party_address;

    @Column(columnDefinition = "varchar(10)")
    private String party_zipcode;

    @Column(columnDefinition = "varchar(30)")
    private String party_city;

    @Column(columnDefinition = "varchar(100)")
    private String party_contact;

    @Column(columnDefinition = "varchar(25)")
    private String party_phone;

    @Column(columnDefinition = "varchar(50)")
    private String party_email;

    @Column
    private Long account_to;

    @Column
    private Long account_from;

    @Column(columnDefinition = "varchar(10)")
    private String provider;

    @Column(columnDefinition = "varchar(255)")
    private String description;

    @Column(columnDefinition = "varchar(45)")
    private String signature;

    @Column(insertable = true, updatable = false)
    private LocalDateTime created;

    @Column(insertable = true, updatable = true)
    private LocalDateTime updated;

    @PrePersist
    void onCreate() {
        this.setCreated(LocalDateTime.now());
        this.setUpdated(LocalDateTime.now());
    }

    @PreUpdate
    void onUpdate() {
        this.setUpdated(LocalDateTime.now());
    }
}
