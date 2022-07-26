package com.hlbank.processing.account;

import com.hlbank.processing.account.entity.Account;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Transactional(propagation = Propagation.MANDATORY)
    public void updateBalances(Account account, Integer amount) {
        logger.info("..updating balance for " + account.getUuid());
        int updatedRecords = this.accountRepository.updateOnholdAvailableBalance(account.getUuid(),
                amount.longValue());
        logger.info("..updated records: " + updatedRecords);
    }
}
