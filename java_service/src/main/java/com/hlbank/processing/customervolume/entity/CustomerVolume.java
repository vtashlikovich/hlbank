package com.hlbank.processing.customervolume.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name="hlb_customer_volume", schema = "PUBLIC")
public class CustomerVolume {

    @Id
    @SequenceGenerator(name = "hlb_customer_volume_id_seq",
            sequenceName = "hlb_customer_volume_id_seq",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "hlb_customer_volume_id_seq")
    private Long id;

    @Column(columnDefinition = "varchar(25)", nullable = false)
    private String customer_uid;

    @Column(nullable = false)
    private Integer month;

    @Column(columnDefinition = "integer default 0", nullable = false)
    private Integer volume;

    @Column(insertable = true, updatable = false)
    private LocalDateTime createdAt;

    @Column(insertable = true, updatable = true)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        this.setCreatedAt(LocalDateTime.now());
        this.setUpdatedAt(LocalDateTime.now());
    }

    @PreUpdate
    void onUpdate() {
        this.setUpdatedAt(LocalDateTime.now());
    }
}
