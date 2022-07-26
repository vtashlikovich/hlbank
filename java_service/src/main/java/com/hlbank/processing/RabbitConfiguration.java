package com.hlbank.processing;

import com.hlbank.processing.transaction.TransactionMessageReceiver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AcknowledgeMode;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;

//@Configuration
@PropertySource("classpath:application.properties")
public class RabbitConfiguration {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Value( "${rabbit.uri}" )
    private String rabbitURI;

    @Bean
    public SimpleMessageListenerContainer messageListenerContainer() {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(rabbitConnectionFactory());
        container.setQueueNames("transactions");
        container.setPrefetchCount(1);
        container.setAcknowledgeMode(AcknowledgeMode.MANUAL);
        RabbitExtendedListenerAdapter listenerAdapter = new RabbitExtendedListenerAdapter();
        listenerAdapter.setDelegate(messageReceiver());
        container.setMessageListener(listenerAdapter);
        return container;
    }

    @Bean
    public TransactionMessageReceiver messageReceiver() {
        return new TransactionMessageReceiver();
    }

    @Bean
    public CachingConnectionFactory rabbitConnectionFactory() {
        CachingConnectionFactory connectionFactory =
                new CachingConnectionFactory("localhost");
        connectionFactory.setUri(rabbitURI);
        return connectionFactory;
    }
}