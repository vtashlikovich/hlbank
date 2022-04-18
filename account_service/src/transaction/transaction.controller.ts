import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    HttpStatus,
    Res,
} from '@nestjs/common'
import { TransactionError, TransactionService } from './transaction.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
// import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { Transaction } from './entities/transaction.entity'
import { Response as ExpressResponse } from 'express'
import { ValidationResult } from './dto/validate-transaction.dto'

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Post('/validate')
    async validate(
        @Res() httpResponse: ExpressResponse,
        @Body() createTransactionDto: CreateTransactionDto
    ): Promise<ExpressResponse> {
        let result: ValidationResult = null

        console.time('timer')
        try {
            result = await this.transactionService.validate(
                createTransactionDto
            )
        } catch (error) {
            console.timeEnd('timer')
            return httpResponse.status(HttpStatus.CONFLICT).send({
                code: error.message,
            })
        }

        console.timeEnd('timer')
        return httpResponse.status(HttpStatus.OK).send(result)
    }

    @Post()
    async create(
        @Res() httpResponse: ExpressResponse,
        @Body() createTransactionDto: CreateTransactionDto
    ): Promise<ExpressResponse> {
        let result: Transaction = null
        console.time('transaction')

        try {
            result = await this.transactionService.create(createTransactionDto)
        } catch (error) {
            if (error.message == TransactionError.DUPLICATION)
                return httpResponse.status(HttpStatus.CONFLICT).send('')
            else {
                console.debug(error)
                console.timeEnd('transaction')
                return httpResponse
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send({
                        error: error.message
                    })
            }
        }
        console.timeEnd('transaction')
        
        return httpResponse.status(HttpStatus.OK).send(result)
    }

    @Get()
    findAll() {
        return this.transactionService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transactionService.findOne(id)
    }

    // @Patch(':id')
    // update(
    //     @Param('id') id: string,
    //     @Body() updateTransactionDto: UpdateTransactionDto
    // ) {
    //     return this.transactionService.update(id, updateTransactionDto)
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.transactionService.remove(+id)
    // }
}
