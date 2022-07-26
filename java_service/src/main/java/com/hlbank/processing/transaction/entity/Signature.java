package com.hlbank.processing.transaction.entity;

import org.springframework.util.DigestUtils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;

public class Signature {
    public String customer_uid;
    public String account_uid;
    public short type;
    public Integer amount;
    public String currency;
    public String party_currency;
    public String fx_rate_uid;
    public String party_bic;
    public String party_iban;
    public String party_account_number;
    public String party_sortcode;
    public String party_bank;
    public short party_type;
    public String party_name;
    public String party_contact;
    public String party_phone;
    public String party_email;
    public Long account_to;
    public String provider;
    public String date;

    public String getHash() throws IOException {
        String result = customer_uid + ";" + account_uid+";"+type+";"+amount+";"+currency+";"+
                party_currency+";"+fx_rate_uid+";"+party_bic+";"+party_iban+";"+party_account_number+";"+
                party_sortcode+";"+party_bank+";"+party_type+";"+party_name+";"+party_contact+";"+party_phone+";"+
                party_email+";"+account_to+";"+provider+";"+date;

        return DigestUtils.md5DigestAsHex(new ByteArrayInputStream(result.getBytes())).toLowerCase();
    }
}
