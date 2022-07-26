package com.hlbank.processing.transaction;

import com.hlbank.processing.account.AccountService;
import com.hlbank.processing.account.entity.Account;
import com.hlbank.processing.customervolume.CustomerVolumeRepository;
import com.hlbank.processing.customervolume.CustomerVolumeService;
import com.hlbank.processing.fee.FeeService;
import com.hlbank.processing.transaction.dto.CreateTransactionDTO;
import com.hlbank.processing.transaction.entity.Transaction;
import com.hlbank.processing.transaction.errors.TransactionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Optional;

@Service
public class TXOperationsService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    TXCreateService txCreateService;

    @Autowired
    private CustomerVolumeRepository customerVolumeRepository;

    @Autowired
    AccountService accountService;

    @Autowired
    CustomerVolumeService customerVolumeService;
    @Autowired
    private FeeService feeService;
    @Autowired
    TransactionValidator transactionValidator;

    @Transactional(propagation = Propagation.REQUIRED)
    public void performTransactionOperations(Optional<Account> account,
                                             CreateTransactionDTO transactionDTO,
                                             Integer fee,
                                             String uuid,
                                             String txSignature)
            throws Exception {
        logger.info("..perform tx operations");

        // save transaction
        Transaction savedTransatction = this.txCreateService.createTX(transactionDTO, fee, uuid, txSignature);

        Integer amount = transactionDTO.getAmount() + fee;

        if (savedTransatction != null) {
            this.accountService.updateBalances(account.get(), amount);
            this.customerVolumeService.updateVolume(savedTransatction.getCustomer_uid(), amount);

            logger.info("Transaction successfully processed, uuid: " + uuid);
        } else
            throw (new Exception("Transaction " + uuid + "creation failed"));
    }

    public Integer quickValidate(CreateTransactionDTO transactionDTO) throws TransactionException, IOException {
        logger.info("..validation");
        // create tx signature
        String txSignature = transactionValidator.createSignature(transactionDTO);
        logger.trace("txSignature = " + txSignature);

        // calculate a fee
        Integer fee = feeService.calculateFee(transactionDTO.getAmount());
        logger.trace("fee = " + fee);

        boolean result = transactionValidator.validateWithSignatureAndFee(
                transactionDTO,
                txSignature,
                fee,
                false,
                true
        );

        logger.info("..validated? " + result);

        if (result)
            return fee;
        else
            return null;
    }
}
