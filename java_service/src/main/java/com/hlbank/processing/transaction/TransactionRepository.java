package com.hlbank.processing.transaction;

import com.hlbank.processing.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends CrudRepository<Transaction, Long>{
    @Query("select count(tx) from Transaction tx where tx.signature = :signature")
    long countBySignature(@Param("signature") String txSignature);
}
