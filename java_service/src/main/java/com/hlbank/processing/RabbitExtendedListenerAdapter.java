package com.hlbank.processing;

import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;

public class RabbitExtendedListenerAdapter extends MessageListenerAdapter {

    @Override
    protected Object[] buildListenerArguments(Object extractedMessage, Channel channel, Message message) {
        return new Object[]{extractedMessage, channel, message};
    }
}