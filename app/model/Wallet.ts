import {
    AutoIncrement,
    Column,
    Comment,
    DataType,
    Default,
    HasMany,
    Index,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";
import { Coin } from "./Coin";

@Table({
    freezeTableName: true,
    timestamps: false,
    underscored: false,
})
export class Wallet extends Model<Wallet> {
    @PrimaryKey
    @AutoIncrement
    @Comment("序号")
    @Column
    public id: number;

    @Comment("底层公链名")
    @Column
    public base: string;

    @Index
    @Comment("钱包地址")
    @Column(DataType.STRING(42))
    public address: string;

    @Comment("钱包私钥")
    @Column(DataType.STRING(64))
    public private: string;

    @HasMany(() => Coin)
    public coins: Coin[];

    @Default(false)
    @Comment("假删除")
    @Column
    public deleted: boolean;
}

export default () => Wallet;
