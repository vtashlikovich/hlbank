import {
    Column,
    CreatedAt,
    Index,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Currency } from 'src/account/currency.enum';
import { TransactionType } from '../util/transaction.types';

@Table({ tableName: 'hlb_transaction' })
export class Transaction extends Model {
    @Column({
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    // @Index('my-index')
    @Column({
        type: DataTypes.STRING(25),
        unique: true,
    })
    uuid: string;

    @Column({
        type: DataTypes.STRING(25),
        allowNull: false,
    })
    customer_uid: string;

    @Column({
        type: DataTypes.STRING(25),
        allowNull: false,
    })
    account_uid: string;

    @Column({
        type: DataTypes.SMALLINT,
        allowNull: false,
    })
    type: TransactionType;

    @Column({
        defaultValue: 1,
        allowNull: false,
    })
    status: number;

    @Column({
        allowNull: false,
    })
    amount: number;

    @Column({
        type: DataTypes.ENUM({ values: Object.keys(Currency) }),
    })
    currency: number;

    @Column({ allowNull: true })
    fee: number;

    @Column({
        defaultValue: 0,
    })
    party_amount: number;

    @Column({
        type: DataTypes.ENUM({ values: Object.keys(Currency) }),
    })
    party_currency: number;

    @Column({
        type: DataTypes.STRING(25),
        allowNull: true,
    })
    fx_rate_uid: number;

    @Column({ allowNull: true })
    fx_rate: number;

    @Column({ type: DataTypes.STRING(14) })
    party_bic: string;

    @Column({ type: DataTypes.STRING(40) })
    party_iban: string;

    @Column({ type: DataTypes.STRING(30) })
    party_account_number: string;

    @Column({ type: DataTypes.STRING(6) })
    party_sortcode: string;

    @Column({ type: DataTypes.STRING(30) })
    party_bank: string;

    @Column({ type: DataTypes.STRING(16) })
    party_bank_country: string;

    @Column({ type: DataTypes.SMALLINT })
    party_type: number;

    @Column({ type: DataTypes.STRING(100) })
    party_name: string;

    @Column({ type: DataTypes.STRING(16) })
    party_country: string;

    @Column({ type: DataTypes.STRING(150) })
    party_address: string;

    @Column({ type: DataTypes.STRING(10) })
    party_zipcode: string;

    @Column({ type: DataTypes.STRING(30) })
    party_city: string;

    @Column({ type: DataTypes.STRING(100) })
    party_contact: string;

    @Column({ type: DataTypes.STRING(25) })
    party_phone: string;

    @Column({ type: DataTypes.STRING(50) })
    party_email: string;

    @Column({ type: DataTypes.BIGINT })
    account_to: number;

    @Column({ type: DataTypes.BIGINT })
    account_from: number;

    @Column({ type: DataTypes.STRING(10) })
    provider: string;

    @Column({ type: DataTypes.STRING(255) })
    description: string;

    @Index('tx_signature')
    @Column({ type: DataTypes.STRING(45) })
    signature: string;

    @CreatedAt
    created: Date = new Date();

    @UpdatedAt
    updated: Date = new Date();
}
