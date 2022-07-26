package com.hlbank.processing.transaction;

import com.hlbank.processing.account.AccountRepository;
import com.hlbank.processing.account.entity.Account;
import com.hlbank.processing.blacklist.BlacklistRepository;
import com.hlbank.processing.customer.CustomerRepository;
import com.hlbank.processing.customer.entity.Customer;
import com.hlbank.processing.customervolume.CustomerVolumeRepository;
import com.hlbank.processing.customervolume.entity.CustomerVolume;
import com.hlbank.processing.transaction.dto.CreateTransactionDTO;
import com.hlbank.processing.transaction.dto.CreateTransactionDTOConverter;
import com.hlbank.processing.transaction.entity.Signature;
import com.hlbank.processing.transaction.errors.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Optional;

@Component
public class TransactionValidator {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private BlacklistRepository blacklistRepository;
    @Autowired
    private CustomerVolumeRepository customerVolumeRepository;
    @Autowired
    private TransactionRepository transactionRepository;

    public boolean validateWithSignatureAndFee(CreateTransactionDTO createTransactionDTO,
                                               String txSignature,
                                               Integer fee,
                                               boolean skipBalanceCheck,
                                               boolean skipBlacklistCheck) throws TransactionException {

        logger.trace("Started validation...");
        // customer
        Optional<Customer> customer = customerRepository.findById(createTransactionDTO.getCustomer_uid());
        if (customer.isEmpty())
            throw(new NotFoundError());

        logger.trace("account...");
        // account
        Optional<Account> account = accountRepository.findByUUID(createTransactionDTO.getAccount_uid());
        if (account.isEmpty())
            throw(new NotFoundError());

        // customer enabled
        if (!customer.get().getEnabled()) {
            logger.warn("Acc " + account.get().getUuid() + ": Customer " +
                    customer.get().getUuid() + " is disabled");
            throw(new UserBlockedError());
        }

        // account enabled
        if (!account.get().getEnabled()) {
            logger.warn("Acc " + account.get().getUuid() + ": account is disabled");
            throw(new AccountBlockedError());
        }

        logger.trace("limit...");
        // transaction limit
        if (checkIfTransactionLimitHit(customer.get(), createTransactionDTO.getAmount() + fee))
            throw(new LimitHitError());

        logger.trace("blacklist...");
        // blacklist
        String accNumber = createTransactionDTO.getParty_account_number();
        if (!skipBlacklistCheck && checkIfPayeeBlacklisted(
                createTransactionDTO.getParty_bic(),
                createTransactionDTO.getParty_iban(),
                accNumber != null && !accNumber.isEmpty()?(createTransactionDTO.getParty_bank() + createTransactionDTO.getParty_account_number()):null,
                createTransactionDTO.getParty_sortcode())
        ) {
            logger.warn("Acc " + account.get().getUuid() + ": Payee account details are in the blacklist");
            throw(new BlacklistedError());
        }

        logger.trace("balance...");
        if (!skipBalanceCheck &&
                !(checkIfAccountBalanceAvailable(
                        account.get(),
                        createTransactionDTO.getAmount() + fee))
        )
            throw(new InsufficientFundsError());

        logger.trace("signature...");
        // check signature
        if (!checkIfIdempotent(txSignature)) {
            logger.warn("Acc " + account.get().getUuid() + ": A duplicated transaction exists, signature: ${txSignature}");
            throw(new DuplicationError());
        }

        logger.trace("...Validation is OK");

        return true;
    }

    boolean checkIfTransactionLimitHit(Customer customer, Integer amount) {
        boolean limitHit = false;

        Calendar calendar = Calendar.getInstance();
        int currentYearMonth =
                calendar.get(Calendar.YEAR) * 100 + calendar.get(Calendar.MONTH) + 1;

        logger.info("find limit for " + customer.getUuid() + ", " + currentYearMonth);
        Iterable<CustomerVolume> monthlyLimitRecords =
                customerVolumeRepository.findOneByCustomerMonth(customer.getUuid(), currentYearMonth);

        CustomerVolume monthlyLimit = null;
        for (CustomerVolume rec: monthlyLimitRecords)
            monthlyLimit = rec;

        if (monthlyLimit != null && monthlyLimit.getVolume() > 0) {
            limitHit = monthlyLimit.getVolume() + amount >= customer.getMonthly_limit();

            if (limitHit)
                logger.warn("Customer " + customer.getUuid() + " monthly limit is hit " +
                        "(" + customer.getMonthly_limit() + "), current volume: " + monthlyLimit.getVolume());
        }

        return limitHit;
    }

    boolean checkIfPayeeBlacklisted(
            String bic,
            String iban,
            String bankaccount,
            String sortcode) {

        return blacklistRepository.findOccurance(bic, iban, bankaccount, sortcode) > 0;
    }

    String createSignature(CreateTransactionDTO transactionDTO) throws IOException {
        Signature signature = new CreateTransactionDTOConverter(transactionDTO).convertToSignature();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("uuuu/MM/dd HH:mm");
        LocalDateTime now = LocalDateTime.now();
        signature.date = now.toString();

        String result = null;
        try {
            result = signature.getHash();
        }
        catch (IOException ioe) {
            logger.error("Cannot convert string to md5 hash");
            throw ioe;
        }

        return result;
    }

    boolean checkIfAccountBalanceAvailable(Account account, Integer amount) {
        boolean result = account.getAvailable_balance() >= amount;
        if (!result)
            logger.warn("Acc " + account.getUuid() + ": not enough funds - " +
                    account.getAvailable_balance() + " vs " + amount);
        return result;
    }

    boolean checkIfIdempotent(String txSignature) {
        long recordsNum = transactionRepository.countBySignature(txSignature);

        return recordsNum == 0;
    }
}
