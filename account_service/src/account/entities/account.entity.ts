import { Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Currency } from '../currency.enum';

@Table({tableName:'hlb_account'})
export class Account extends Model{
    @Column({
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @Column({
        type: DataTypes.STRING(25),
        unique: true
    })
    uuid: string;
    
    @Column({
        type: DataTypes.BIGINT,
        allowNull: false
    })
    customer_id: number;
    
    @Column({
        defaultValue: 1,
        allowNull: false
    })
    status: number;

    @Column({
        type: DataTypes.STRING(50)
    })
    label: string;

    @Column({
        type: DataTypes.ENUM({ values: Object.keys(Currency) })
    })
    currency: string;

    @Column({
        defaultValue: 0,
        allowNull: false
    })
    current_balance: number;

    @Column({
        defaultValue: 0,
        allowNull: false
    })
    onhold_balance: number;

    @Column({
        defaultValue: 0,
        allowNull: false
    })
    available_balance: number;

    @Column({
        allowNull: false
    })
    bank_id: number;

    @Column({
        type: DataTypes.STRING(35)
    })
    iban: string;

    @Column({
        type: DataTypes.STRING(30)
    })
    account_number: string;

    @Column({
        type: DataTypes.STRING(6)
    })
    sort_code: string;

    @CreatedAt
    created: Date = new Date();

    @UpdatedAt
    updated: Date = new Date();
}
