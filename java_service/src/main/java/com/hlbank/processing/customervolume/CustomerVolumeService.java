package com.hlbank.processing.customervolume;

import com.hlbank.processing.customervolume.entity.CustomerVolume;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;

@Service
public class CustomerVolumeService {

    @Autowired
    private CustomerVolumeRepository customerVolumeRepository;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Transactional(propagation = Propagation.MANDATORY)
    public int updateVolume(String customer_uid, Integer amount) {
        int records = 0;

        Calendar calendar = Calendar.getInstance();
        int currentYearMonth =
                calendar.get(Calendar.YEAR) * 100 + calendar.get(Calendar.MONTH) + 1;

        logger.info("..search for volume for " + customer_uid + ", " + currentYearMonth);
        Iterable<CustomerVolume> customerVolumeRecs = this.customerVolumeRepository.findOneByCustomerMonth(customer_uid, currentYearMonth);
        CustomerVolume customerVolume = null;
        for (CustomerVolume rec: customerVolumeRecs)
            customerVolume = rec;

        if (customerVolume != null) {
            CustomerVolume newVustomerVolume = new CustomerVolume();
            newVustomerVolume.setVolume(amount);
            newVustomerVolume.setCustomer_uid(customer_uid);
            newVustomerVolume.setMonth(currentYearMonth);
            logger.info("..create new volume");
            CustomerVolume savedCustomerVolume = this.customerVolumeRepository.save(newVustomerVolume);
            records = savedCustomerVolume != null?1:records;
        }
        else {
            logger.info("..update extisting volume");
            records = this.customerVolumeRepository.updateVolume(amount, customer_uid, currentYearMonth);
        }

        logger.info("Customer volume updated, " + customer_uid + ", " + currentYearMonth + ", " + amount);

        return records;
    }
}
