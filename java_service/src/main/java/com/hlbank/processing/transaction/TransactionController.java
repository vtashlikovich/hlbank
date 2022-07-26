package com.hlbank.processing.transaction;

import com.hlbank.processing.transaction.dto.CreateTransactionDTO;
import com.hlbank.processing.transaction.dto.CreateTransactionDTOConverter;
import com.hlbank.processing.transaction.entity.Transaction;
import com.hlbank.processing.transaction.errors.DuplicationError;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/transaction")
public class TransactionController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    TXOperationsService txOperationsService;

    @Autowired
    RabbitTemplate rabbitTemplate;

    @Autowired
    MessageSender messageSender;

    @GetMapping("/")
    public ResponseEntity<Iterable<Transaction>> getTransactions() {
        return ResponseEntity.ok(this.transactionRepository.findAll());
    }

    @GetMapping("/test")
    public ResponseEntity<String> testCall() {
        return ResponseEntity.ok("Hello");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Transaction>> setTransactionByID(
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(this.transactionRepository.findById(id));
    }

    public void listen(String in) {
        System.out.println("Message read from myQueue : " + in);
    }

    @RequestMapping(value="", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> createTransaction(
            @Valid @RequestBody CreateTransactionDTO transactionDTO,
            Errors errors) {
        logger.info("new POST transaction request " + transactionDTO.getAmount());

        if (errors.hasErrors()) {
            logger.error("there are convertion errors");
            List<String> outErrors = new ArrayList<String>();
            for (ObjectError error: errors.getAllErrors())
                outErrors.add(error.getDefaultMessage());

            return ResponseEntity.badRequest().body(outErrors);
        }

        try {
            if (txOperationsService.quickValidate(transactionDTO) != null) {
                String uuid = generateUuidIfNeeded(transactionDTO);
                transactionDTO.setUuid(uuid);
                logger.info("uuid: " + uuid);
                messageSender.sendMessage(transactionDTO);
            }
        }
        catch (DuplicationError duplicationError) {
            logger.error("Error: duplication");
            return new ResponseEntity(HttpStatus.CONFLICT);
        }
        catch (Exception generalError) {
            logger.error("Error: general " + generalError.getMessage());
            generalError.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return ResponseEntity.ok().build();
    }

    @Deprecated
    public ResponseEntity<?> createTransactionTEST(
        @Valid @RequestBody CreateTransactionDTO transactionDTO,
        Errors errors) {
            if (errors.hasErrors()) {
                List<String> outErrors = new ArrayList<String>();
                for (ObjectError error: errors.getAllErrors())
                    outErrors.add(error.getDefaultMessage());
                
                return ResponseEntity.badRequest().body(outErrors);
            }

            Transaction result = this.transactionRepository.save(new CreateTransactionDTOConverter(transactionDTO).convert());
            URI location = ServletUriComponentsBuilder.fromCurrentRequest().
                path("/{id}").buildAndExpand(result.getId()).toUri();

            return ResponseEntity.created(location).build();
    }

    String generateUuidIfNeeded(CreateTransactionDTO transactionDTO) {
        return transactionDTO.getUuid() == null || transactionDTO.getUuid().isBlank()?
                UUID.randomUUID().toString().replaceAll("-", "").toUpperCase()
                :transactionDTO.getUuid();
    }
}
