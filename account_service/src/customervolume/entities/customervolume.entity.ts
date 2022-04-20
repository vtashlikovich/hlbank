import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ tableName: 'hlb_customer_volume' })
export class Customervolume extends Model<Customervolume> {
    @Column({
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataTypes.STRING(25),
        primaryKey: true,
    })
    customer_uid: string;

    @Column({
        type: DataTypes.INTEGER,
        allowNull: false,
    })
    month: number;

    @Column({
        allowNull: false,
        defaultValue: 0,
    })
    volume: number;
}
