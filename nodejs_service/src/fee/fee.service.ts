import { Injectable } from '@nestjs/common';

export const FEE_MIN = 100;
export const FEE_PERCENT_100k = 0.025;
export const FEE_PERCENT_10k = 0.05;

@Injectable()
export class FeeService {
    calculateFee(amount: number | null): number | null {
        let fee = FEE_MIN;

        if (amount === null)
            return null;
        else if (amount > 100000) fee = Math.floor(amount * FEE_PERCENT_100k);
        else if (amount > 10000) fee = Math.floor(amount * FEE_PERCENT_10k);

        return fee;
    }
}
