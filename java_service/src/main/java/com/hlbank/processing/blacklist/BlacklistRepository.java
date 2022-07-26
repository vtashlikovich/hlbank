package com.hlbank.processing.blacklist;

import com.hlbank.processing.blacklist.entity.Blacklist;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface BlacklistRepository extends CrudRepository<Blacklist, Long> {

    @Query("select count(bl) from Blacklist bl where bl.bic = COALESCE(:bic, 'N/A') or bl.iban = COALESCE(:iban, 'N/A') or " +
            "bl.bankaccount = COALESCE(:bankaccount, 'N/A') or bl.sortcode = COALESCE(:sortcode, 'N/A')")
    int findOccurance(
            @Param("bic") String bic,
            @Param("iban") String iban,
            @Param("bankaccount") String bankaccount,
            @Param("sortcode") String sortcode
    );
}
