import { Column, Model, Table } from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

@Table({ tableName: 'hlb_blacklist' })
export class Blacklist extends Model<Blacklist> {
    @Column({
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number

    @Column({
        type: DataTypes.STRING(14),
        allowNull: true,
    })
    bic: string

    @Column({
        type: DataTypes.STRING(40),
        allowNull: true,
    })
    iban: string

    @Column({
        type: DataTypes.STRING(30),
        allowNull: true,
    })
    bankaccount: string

    @Column({
        type: DataTypes.STRING(6),
        allowNull: true,
    })
    sortcode: string
}
