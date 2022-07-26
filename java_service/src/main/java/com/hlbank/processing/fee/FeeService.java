package com.hlbank.processing.fee;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class FeeService {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private static final int FEE_MIN = 100;
    private static final double FEE_PERCENT_100k = 0.025;
    private static final double FEE_PERCENT_10k = 0.05;

    public Integer calculateFee(Integer amount) {
        logger.info("calculating fee for amount " + amount);
        Integer fee = FEE_MIN;

        if (amount == null)
            return 0;
        else if (amount > 100000) fee = (int)Math.floor(amount * FEE_PERCENT_100k);
        else if (amount > 10000) fee = (int)Math.floor(amount * FEE_PERCENT_10k);

        return fee;
    }
}
