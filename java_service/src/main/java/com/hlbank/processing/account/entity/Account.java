package com.hlbank.processing.account.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name="hlb_account", schema = "PUBLIC")
public class Account {

    @Id
    @SequenceGenerator(name = "hlb_account_id_seq",
            sequenceName = "hlb_account_id_seq",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "hlb_account_id_seq")
    private Long id;

    @Column(columnDefinition = "varchar(25)", unique = true)
    private String uuid;

    @Column(columnDefinition = "boolean default true", nullable = false)
    private Boolean enabled;

    @Column(nullable = false)
    private Long customer_id;

    @Column(columnDefinition = "integer default 1", nullable = false)
    private Integer status;

    @Column(columnDefinition = "varchar(50)")
    private String label;

    @Column(columnDefinition = "varchar(3)")
    private String currency;

    @Column(columnDefinition = "integer default 0", nullable = false)
    private Long current_balance;

    @Column(columnDefinition = "integer default 0", nullable = false)
    private Long onhold_balance;

    @Column(columnDefinition = "integer default 0", nullable = false)
    private Long available_balance;

    @Column(nullable = false)
    private Integer bank_id;

    @Column(columnDefinition = "varchar(35)")
    private String iban;

    @Column(columnDefinition = "varchar(30)")
    private String account_number;

    @Column(columnDefinition = "varchar(6)")
    private String sort_code;

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
