package com.hlbank.processing.account;

import com.hlbank.processing.account.entity.Account;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends CrudRepository<Account, Long> {

    @Query("select acc from Account acc where acc.uuid = :uuid")
    Optional<Account> findByUUID(@Param("uuid") String uuid);

    @Modifying
    @Query("update Account set onhold_balance = onhold_balance + :amount, " +
            " available_balance = available_balance - :amount where uuid = :uuid " +
            " and available_balance > :amount")
    int updateOnholdAvailableBalance(@Param("uuid") String uuid, @Param("amount") Long amount);
}
