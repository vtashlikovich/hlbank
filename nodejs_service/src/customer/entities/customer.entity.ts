import {
    Column,
    CreatedAt,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ tableName: 'hlb_customer' })
export class Customer extends Model<Customer> {
    @Column({
        type: DataTypes.STRING(25),
        primaryKey: true,
    })
    uuid: string;

    @Column({
        allowNull: false,
        defaultValue: true,
    })
    enabled: boolean;

    @Column({
        allowNull: false,
        defaultValue: 1000,
    })
    monthly_limit: number;

    @CreatedAt
    created: Date = new Date();

    @UpdatedAt
    updated: Date = new Date();
}
