import {
    AllowNull,
    AutoIncrement,
    Column,
    Comment,
    DataType,
    Default,
    Index,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from "sequelize-typescript";

@Table({
    freezeTableName: true,
    timestamps: false,
    underscored: false,
})
export class Version extends Model<Version> {
    @PrimaryKey
    @AutoIncrement
    @Comment("序号")
    @Column
    public id: number;

    @Index
    @AllowNull(false)
    @Unique
    @Comment("钱包名或项目名")
    @Column
    public walletName: string;

    @Comment("版本号（例：12.4.56）")
    @Column
    public version: string;

    @Comment("版本号的数字化表示（例：120456）")
    @Column
    public versionNumber: number;

    @Comment("有效版本号，即该版本以上不用强制更新（例：12.4.56）")
    @Column
    public validVersion: string;

    @Comment("有效版本号的数字化表示（例：120456）")
    @Column
    public validVersionNumber: number;

    @Comment("更新地址")
    @Column(DataType.TEXT)
    public downloadUrl: string;

    @Default(false)
    @Comment("假删除")
    @Column
    public deleted: boolean;
}

export default () => Version;
