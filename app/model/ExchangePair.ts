import {
    AutoIncrement,
    BelongsTo,
    Column,
    Comment,
    DataType,
    Default,
    ForeignKey,
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
export class ExchangePair extends Model<ExchangePair> {
    @PrimaryKey
    @AutoIncrement
    @Comment("序号")
    @Column
    public id: number;

    @Index
    @ForeignKey(() => Coin)
    @Comment("来源币种序号")
    @Column
    public sourceCoinId: number;

    @BelongsTo(() => Coin, "sourceCoinId")
    public sourceCoin: Coin;

    @Index
    @ForeignKey(() => Coin)
    @Comment("目标币种序号")
    @Column
    public targetCoinId: number;

    @BelongsTo(() => Coin, "targetCoinId")
    public targetCoin: Coin;

    @Comment("兑换比率")
    @Column(DataType.FLOAT)
    public rate: number;

    @Comment("该小时兑换量（以来源币种为单位）")
    @Column(DataType.FLOAT)
    public hourAmount: number;

    @Comment("每小时限额（以来源币种为单位）")
    @Column(DataType.FLOAT)
    public hourLimit: number;

    @Comment("该日兑换量（以来源币种为单位）")
    @Column(DataType.FLOAT)
    public dayAmount: number;

    @Comment("每日限额（以来源币种为单位）")
    @Column(DataType.FLOAT)
    public dayLimit: number;

    @Default(false)
    @Comment("假删除")
    @Column
    public deleted: boolean;
}

export default () => ExchangePair;
