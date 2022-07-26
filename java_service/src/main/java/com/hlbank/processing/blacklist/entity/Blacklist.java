package com.hlbank.processing.blacklist.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@Table(name="hlb_blacklist", schema = "PUBLIC")
public class Blacklist {

    @Id
    @SequenceGenerator(name = "hlb_blacklist_id_seq",
            sequenceName = "hlb_blacklist_id_seq",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "hlb_blacklist_id_seq")
    private Long id;

    @Column(columnDefinition = "varchar(14)")
    private String bic;

    @Column(columnDefinition = "varchar(40)")
    private String iban;

    @Column(columnDefinition = "varchar(30)")
    private String bankaccount;

    @Column(columnDefinition = "varchar(6)")
    private String sortcode;
}
