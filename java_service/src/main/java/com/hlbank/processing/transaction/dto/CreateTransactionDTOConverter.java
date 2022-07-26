package com.hlbank.processing.transaction.dto;

import com.hlbank.processing.transaction.entity.Signature;
import com.hlbank.processing.transaction.entity.Transaction;

import javax.validation.constraints.Email;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import java.time.LocalDateTime;

public class CreateTransactionDTOConverter {
    private CreateTransactionDTO transactionDTO;

    public CreateTransactionDTOConverter(CreateTransactionDTO transactionDTO) {
        this.transactionDTO = transactionDTO;
    }

    CreateTransactionDTO getTransactionDTO() {
        return transactionDTO;
    }

    public Transaction convert() {
        Transaction transaction = new Transaction();

        if (getTransactionDTO().getUuid() != null)
            transaction.setUuid(getTransactionDTO().getUuid());

        transaction.setCustomer_uid(getTransactionDTO().getCustomer_uid());

        if (getTransactionDTO().getAccount_uid() != null)
            transaction.setAccount_uid(getTransactionDTO().getAccount_uid());

        transaction.setType(getTransactionDTO().getType());

        transaction.setAmount(getTransactionDTO().getAmount());

        if (getTransactionDTO().getCurrency() != null)
            transaction.setCurrency(getTransactionDTO().getCurrency());

        if (getTransactionDTO().getParty_currency() != null)
            transaction.setParty_currency(getTransactionDTO().getParty_currency());

        if (getTransactionDTO().getFx_rate_uid() != null)
            transaction.setFx_rate_uid(getTransactionDTO().getFx_rate_uid());

        if (getTransactionDTO().getParty_bic() != null)
            transaction.setParty_bic(getTransactionDTO().getParty_bic());

        if (getTransactionDTO().getParty_iban() != null)
            transaction.setParty_iban(getTransactionDTO().getParty_iban());

        if (getTransactionDTO().getParty_account_number() != null)
            transaction.setParty_account_number(getTransactionDTO().getParty_account_number());

        if (getTransactionDTO().getParty_sortcode() != null)
            transaction.setParty_sortcode(getTransactionDTO().getParty_sortcode());

        if (getTransactionDTO().getParty_bank() != null)
            transaction.setParty_bank(getTransactionDTO().getParty_bank());

        if (getTransactionDTO().getParty_bank_country() != null)
            transaction.setParty_bank_country(getTransactionDTO().getParty_bank_country());

        if (getTransactionDTO().getParty_type() > -1)
            transaction.setParty_type(getTransactionDTO().getParty_type());

        if (getTransactionDTO().getParty_name() != null)
            transaction.setParty_name(getTransactionDTO().getParty_name());

        if (getTransactionDTO().getParty_country() != null)
            transaction.setParty_country(getTransactionDTO().getParty_country());

        if (getTransactionDTO().getParty_address() != null)
            transaction.setParty_address(getTransactionDTO().getParty_address());

        if (getTransactionDTO().getParty_zipcode() != null)
            transaction.setParty_zipcode(getTransactionDTO().getParty_zipcode());

        if (getTransactionDTO().getParty_city() != null)
            transaction.setParty_city(getTransactionDTO().getParty_city());

        if (getTransactionDTO().getParty_contact() != null)
            transaction.setParty_contact(getTransactionDTO().getParty_contact());

        if (getTransactionDTO().getParty_phone() != null)
            transaction.setParty_phone(getTransactionDTO().getParty_phone());

        if (getTransactionDTO().getParty_email() != null)
            transaction.setParty_email(getTransactionDTO().getParty_email());

        if (getTransactionDTO().getAccount_to() != null)
            transaction.setAccount_to(getTransactionDTO().getAccount_to());

        if (getTransactionDTO().getAccount_from() != null)
            transaction.setAccount_from(getTransactionDTO().getAccount_from());

        transaction.setProvider(getTransactionDTO().getProvider());

        if (getTransactionDTO().getDescription() != null)
            transaction.setDescription(getTransactionDTO().getDescription());

        return transaction;
    }

    public Signature convertToSignature() {
        Signature signature = new Signature();

        signature.customer_uid = getTransactionDTO().getCustomer_uid();
        signature.account_uid = getTransactionDTO().getAccount_uid();
        signature.type = getTransactionDTO().getType();
        signature.amount = getTransactionDTO().getAmount();
        signature.currency = getTransactionDTO().getCurrency();
        signature.party_currency = getTransactionDTO().getParty_currency();
        signature.fx_rate_uid = getTransactionDTO().getFx_rate_uid();
        signature.party_bic = getTransactionDTO().getParty_bic();
        signature.party_iban = getTransactionDTO().getParty_iban();
        signature.party_account_number = getTransactionDTO().getParty_account_number();
        signature.party_sortcode = getTransactionDTO().getParty_sortcode();
        signature.party_bank = getTransactionDTO().getParty_bank();
        signature.party_type = getTransactionDTO().getParty_type();
        signature.party_name = getTransactionDTO().getParty_name();
        signature.party_contact = getTransactionDTO().getParty_contact();
        signature.party_phone = getTransactionDTO().getParty_phone();
        signature.party_email = getTransactionDTO().getParty_email();
        signature.account_to = getTransactionDTO().getAccount_to();
        signature.provider = getTransactionDTO().getProvider();

        return signature;
    }
}
