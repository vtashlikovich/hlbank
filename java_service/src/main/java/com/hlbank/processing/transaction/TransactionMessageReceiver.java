package com.hlbank.processing.transaction;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hlbank.processing.account.AccountRepository;
import com.hlbank.processing.account.entity.Account;
import com.hlbank.processing.fee.FeeService;
import com.hlbank.processing.transaction.dto.CreateTransactionDTO;
import com.hlbank.processing.transaction.dto.CreateTransactionDTOConverter;
import com.hlbank.processing.transaction.entity.Transaction;
import com.hlbank.processing.transaction.errors.InternalError;
import com.hlbank.processing.transaction.errors.*;
import com.rabbitmq.client.Channel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Component
public class TransactionMessageReceiver {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    TXOperationsService txOperationsService;
    @Autowired
    private FeeService feeService;
    @Autowired
    TransactionValidator transactionValidator;

    public void handleMessage(Object object, Channel channel, Message message) throws IOException {

        boolean saveErrorTransaction = false;
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        try {
            processMessage(message);

            channel.basicAck(deliveryTag, false);
        } catch (TransactionException transactionException) {
            saveErrorTransaction = true;
            if (transactionException instanceof DuplicationError) {
                logger.warn("Duplicated transaction has been detected from the queue. Rejecting");

                channel.basicAck(deliveryTag, false);
                saveErrorTransaction = false;
            }
            else if (transactionException instanceof InternalError)
            {
                logger.error("Internal error, Rejecting");
                channel.basicNack(deliveryTag, false, true);
                saveErrorTransaction = false;
            }
        } catch (Exception common) {
            logger.warn("transaction ${newTransaction.uuid} error is not recognized, getting back to the queue");
            channel.basicNack(deliveryTag, false, true);
        }

        if (saveErrorTransaction) {
            try {
                this.createErrorTransaction(message);
                channel.basicAck(deliveryTag, false);
            } catch (Exception exc) {
                System.err.println("Error saving transaction ${newTransaction.uuid} with ERROR state");
                channel.basicNack(deliveryTag, false, true);
            }
        }
    }

    public void processMessage(Message message) throws TransactionException, Exception {

        CreateTransactionDTO transactionDTO = convertMessageToTransactionDTO(message);

        if (transactionDTO == null)
            throw new InternalError();

        // create tx signature
        String txSignature = transactionValidator.createSignature(transactionDTO);
        logger.trace("txSignature = " + txSignature);

        // calculate a fee
        Integer fee = feeService.calculateFee(transactionDTO.getAmount());
        logger.trace("fee = " + fee);

        try {
            // validation
            boolean validationResult = transactionValidator.validateWithSignatureAndFee(
                    transactionDTO,
                    txSignature,
                    fee,
                    true,
                    false
            );
            logger.trace("validationResult " + validationResult);

            if (validationResult) {

                // generate UID
                String uuid = generateUuidIfNeeded(transactionDTO);
                logger.info("uuid: " + uuid);

                logger.info("..find account");
                Optional<Account> account = accountRepository.findByUUID(transactionDTO.getAccount_uid());

                if (account.isPresent()) {
                    if (account.get().getAvailable_balance() >= transactionDTO.getAmount() + fee)
                        txOperationsService.performTransactionOperations(account, transactionDTO, fee, uuid, txSignature);
                    else
                        throw (new InsufficientFundsError());
                } else
                    throw (new NotFoundError());
            }
        } catch (Exception error) {
            logger.error("Transaction ${createTransactionDto.uuid}: Cannot validate or insert a new tranaction: " +
                    error.getClass().getName() + ", " + error.getMessage());

            throw(error);
        }
    }

    CreateTransactionDTO convertMessageToTransactionDTO(Message message) {
        String jsonString = new String(message.getBody());
        logger.trace(jsonString);

        // extract only data field from the enriched JSON if needed
        String dataField = "\"data\":";
        int dataFieldIndex = jsonString.indexOf(dataField);
        if (dataFieldIndex >= 0)
            jsonString = jsonString.substring(dataFieldIndex + dataField.length(), jsonString.length() - 1);

        ObjectMapper mapper = new ObjectMapper();

        CreateTransactionDTO transactionDTO = null;
        try {
            transactionDTO = mapper.readValue(jsonString, CreateTransactionDTO.class);
        }
        catch (Exception exc) {
            logger.error("Error while parsing JSON " + exc.getMessage());
            exc.printStackTrace();
        }

        return transactionDTO;
    }

    void createErrorTransaction(Message message) throws Exception {

        CreateTransactionDTO transactionDTO = convertMessageToTransactionDTO(message);

        if (transactionDTO == null)
            throw new InternalError();

        String uuid = generateUuidIfNeeded(transactionDTO);
        logger.info("uuid: " + uuid);

        String txSignature = transactionValidator.createSignature(transactionDTO);
        logger.trace("txSignature = " + txSignature);

        Transaction convertedTransaction = new CreateTransactionDTOConverter(transactionDTO).convert();
        convertedTransaction.setFee(0);
        convertedTransaction.setUuid(uuid);
        convertedTransaction.setSignature(txSignature);
        convertedTransaction.setStatus(TransactionStatus.ERROR);
        this.transactionRepository.save(convertedTransaction);

        logger.trace("Error transaction created = " + uuid);
    }

    String generateUuidIfNeeded(CreateTransactionDTO transactionDTO) {
        return transactionDTO.getUuid() == null || transactionDTO.getUuid().isBlank()?
                UUID.randomUUID().toString().replaceAll("-", "").toUpperCase()
                :transactionDTO.getUuid();
    }
}
