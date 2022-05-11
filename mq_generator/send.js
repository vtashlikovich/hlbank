#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'transactions';
        var msg = { pattern: 'create-tx', 
            data: {
                "customer_uid": "CUFDFDFDF",
                "account_uid": "ACFFEEREG",
                "type": 1,
                "amount": 100,
                "currency": "USD",
                "fx_rate_uid": "FX34234324",
                "party_bic": "ALPEAT22",
                "party_iban": "AT611904300234573201",
                "party_account_number": "11",
                "party_sortcode": "",
                "party_bank": "FastClood",
                "party_bank_country": "NO",
                "party_type": 1,
                "party_name": "John Gold",
                "party_country": "MARS",
                "party_address": "Olympus Mons",
                "party_zipcode": "00-001",
                "party_city": "New Mars",
                "party_contact": "Ygr L'ya",
                "party_phone": "+MARS0122120545",
                "party_email": "ygrlya@mars.planet",
                "provider": "GALAXY",
                "description": "To my marsian friend"
            }
        };

        channel.assertQueue(queue, {
            durable: true
        });
        channel.sendToQueue(queue, 
            Buffer.from(JSON.stringify(msg)), 
            { persistent: true, headers: { "x-version": "1.0" } }
            );

        console.log(" [x] Sent %s", msg);
    });
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});