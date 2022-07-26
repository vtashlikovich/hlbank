package com.hlbank.processing.transaction;

import com.hlbank.processing.transaction.dto.CreateTransactionDTO;
import com.hlbank.processing.transaction.dto.MessageDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.stereotype.Service;

@Service
public class MessageSender {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final RabbitTemplate rabbitTemplate;

    public MessageSender(final RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendMessage(CreateTransactionDTO transactionDTO) {
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setData(transactionDTO);
        Message message = new Jackson2JsonMessageConverter().toMessage(messageDTO, null);
        String queueName = "transactions" + getQueueIndex(transactionDTO.getAccount_uid());
        logger.info("sending message to queue " + queueName);
        rabbitTemplate.send(queueName, message);
    }

    /**
     * Hashing function, determines which transactions group/queue to choose
     * @param uuid - account ID
     * @return index of the group/queue
     */
    int getQueueIndex(String uuid) {
        int asciiCode = uuid.length() > 17?(int)uuid.charAt(18):0;

        if (48 <= asciiCode && asciiCode <= 51)
            return 1;
        else if (52 <= asciiCode && asciiCode <= 55)
            return 2;
        else if (asciiCode == 56 || asciiCode == 57 || 65 <= asciiCode && asciiCode <= 67)
            return 3;
        else if (68 <= asciiCode && asciiCode <= 71)
            return 4;
        else if (72 <= asciiCode && asciiCode <= 76)
            return 5;
        else if (77 <= asciiCode && asciiCode <= 80)
            return 6;
        else if (81 <= asciiCode && asciiCode <= 85)
            return 7;
        else
            return 8;
    }
}
