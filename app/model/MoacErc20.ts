import {
    AutoIncrement,
    Column,
    Comment,
    DataType,
    Default,
    Index,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";

@Table({
    freezeTableName: true,
    timestamps: false,
    underscored: false,
})
export class MoacErc20 extends Model<MoacErc20> {
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

    @Index
    @Comment("部署合约时的交易hash")
    @Column(DataType.STRING(66))
    public txHash: string;

    @Comment("币种精度")
    @Column
    public decimals: number;

    @Comment("币种总发行量")
    @Column
    public supply: string;

    @Comment("合约部署者")
    @Column(DataType.STRING(42))
    public owner: string;

    @Comment("余额")
    @Column(DataType.FLOAT)
    public balance: number;

    @Comment("币种图标")
    @Column(DataType.TEXT)
    public icon: string;

    @Default(false)
    @Comment("假删除")
    @Column
    public deleted: boolean;
}

export default () => MoacErc20;
