import {
    AutoIncrement,
    BelongsTo,
    Column,
    Comment,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Index,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";
import { Wallet } from "./Wallet";
import { ExchangePair } from "./ExchangePair";

@Table({
    freezeTableName: true,
    timestamps: false,
    underscored: false,
})
export class Coin extends Model<Coin> {
    @PrimaryKey
    @AutoIncrement
    @Comment("序号")
    @Column
    public id: number;

    @Comment("底层公链名")
    @Column
    public base: string;

    @Index
    @Comment("币种简称")
    @Column
    public symbol: string;

    @Index
    @Comment("币种全称")
    @Column
    public name: string;

    @Index
    @Comment("合约地址")
    @Column(DataType.STRING(42))
    public address: string;

    @Comment("币种精度")
    @Column
    public decimals: number;

    @Comment("币种总发行量")
    @Column
    public supply: string;

    @Comment("合约部署者")
    @Column(DataType.STRING(42))
    public owner: string;

    @Comment("币种图标")
    @Column(DataType.TEXT)
    public icon: string;

    @Index
    @ForeignKey(() => Wallet)
    @Comment("钱包序号")
    @Column
    public walletId: number;

    @BelongsTo(() => Wallet)
    public wallet: Wallet;

    @Default(0)
    @Comment("单次转账的最大金额（自然单位）")
    @Column(DataType.FLOAT)
    public maxAmount: number;

    @Default(0)
    @Comment("单次转账的最小金额（自然单位）")
    @Column(DataType.FLOAT)
    public minAmount: number;

    @HasMany(() => ExchangePair, "sourceCoinId")
    public sourceCoins: ExchangePair[];

    @HasMany(() => ExchangePair, "targetCoinId")
    public targetCoins: ExchangePair[];

    @Default(false)
    @Comment("假删除")
    @Column
    public deleted: boolean;
}

export default () => Coin;
