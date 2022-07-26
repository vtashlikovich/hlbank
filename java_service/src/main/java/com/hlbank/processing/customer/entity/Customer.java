package com.hlbank.processing.customer.entity;

import com.hlbank.processing.transaction.entity.CurrencyEnumType;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name="hlb_customer", schema = "PUBLIC")
public class Customer {
    @Id
    @GeneratedValue
    private String uuid;

    @Column(columnDefinition = "boolean default true", nullable = false)
    private Boolean enabled;

    @Column(columnDefinition = "integer default 1000", nullable = false)
    private Integer monthly_limit;
}
