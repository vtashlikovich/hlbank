package com.hlbank.processing.transaction;

import com.hlbank.processing.transaction.dto.CreateTransactionDTO;
import com.hlbank.processing.transaction.dto.CreateTransactionDTOConverter;
import com.hlbank.processing.transaction.entity.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TXCreateService {

    @Autowired
    private TransactionRepository transactionRepository;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Transactional(propagation = Propagation.MANDATORY)
    public Transaction createTX(CreateTransactionDTO transactionDTO,
                         Integer fee,
                         String uuid,
                         String txSignature) {
        Transaction convertedTransaction = new CreateTransactionDTOConverter(transactionDTO).convert();
        convertedTransaction.setFee(fee);
        convertedTransaction.setUuid(uuid);
        convertedTransaction.setSignature(txSignature);
        logger.info("..insert new tx");
        return this.transactionRepository.save(convertedTransaction);
    }
}
