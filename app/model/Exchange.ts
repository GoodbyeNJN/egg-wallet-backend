import {
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
import { ExchangePair } from "./ExchangePair";

@Table({
    freezeTableName: true,
    timestamps: false,
    underscored: false,
})
export class Exchange extends Model<Exchange> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Comment("交易编号")
    @Column(DataType.UUID)
    public id: string;

    @Index
    @ForeignKey(() => ExchangePair)
    @Comment("币种交易对的序号")
    @Column
    public exchangePairId: number;

    @BelongsTo(() => ExchangePair)
    public exchangePair: ExchangePair;

    @Comment("创建交易时的兑换比率")
    @Column(DataType.FLOAT)
    public rate: number;

    @Comment("创建交易时的时间")
    @Column
    public time: Date;

    @Comment("第一笔转账交易状态（success、fail、pending）")
    @Column
    public payStatus: string;

    @Index
    @Comment("第一笔转账hash")
    @Column(DataType.STRING(66))
    public payHash: string;

    @Index
    @Comment("第一笔转账的付款钱包地址")
    @Column(DataType.STRING(42))
    public payAddress: string;

    @Comment("第一笔转账的金额（自然单位）")
    @Column(DataType.FLOAT)
    public payAmount: number;

    @Comment("第一笔转账的发起时间")
    @Column
    public payTime: Date;

    @Comment("第二笔转账交易状态（success、fail、pending）")
    @Column
    public receiveStatus: string;

    @Index
    @Comment("第二笔转账hash")
    @Column(DataType.STRING(66))
    public receiveHash: string;

    @Index
    @Comment("第二笔转账的付款钱包地址")
    @Column(DataType.STRING(42))
    public receiveAddress: string;

    @Comment("第二笔转账的金额（自然单位）")
    @Column(DataType.FLOAT)
    public receiveAmount: number;

    @Comment("第二笔转账的发起时间")
    @Column
    public receiveTime: Date;

    @Default(false)
    @Comment("假删除")
    @Column
    public deleted: boolean;
}

export default () => Exchange;
