import { Injectable } from '@nestjs/common'

@Injectable()
export class FeeService {
    getFee(amount: number): number {
        let fee = 100

        if (amount > 100000) fee = Math.floor(amount * 0.025)
        else if (amount > 10000) fee = Math.floor(amount * 0.05)

        return fee
    }
}
