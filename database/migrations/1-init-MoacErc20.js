module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
            Add altering commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        const { INTEGER, STRING, TEXT, BOOLEAN } = Sequelize;

        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                "MoacErc20",
                {
                    id: { type: INTEGER, comment: "序号", autoIncrement: true, primaryKey: true },
                    base: { type: STRING, comment: "底层公链名" },
                    symbol: { type: STRING, comment: "币种简称" },
                    name: { type: STRING, comment: "币种全称" },
                    address: { type: STRING(42), comment: "合约地址" },
                    txHash: { type: STRING(66), comment: "部署合约时的交易hash" },
                    decimals: { type: INTEGER, comment: "币种精度" },
                    supply: { type: STRING, comment: "币种总发行量" },
                    owner: { type: STRING(42), comment: "合约部署者" },
                    icon: { type: TEXT, comment: "币种图标" },
                    deleted: { type: BOOLEAN, comment: "假删除", defaultValue: false },
                },
                {
                    charset: "utf8",
                    transaction,
                },
            );

            await queryInterface.addIndex("MoacErc20", ["symbol"], { transaction });
            await queryInterface.addIndex("MoacErc20", ["name"], { transaction });
            await queryInterface.addIndex("MoacErc20", ["address"], { transaction });
            await queryInterface.addIndex("MoacErc20", ["txHash"], { transaction });

            transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: (queryInterface, Sequelize) => {
        /*
            Add reverting commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.dropTable('users');
        */
        return queryInterface.dropTable("MoacErc20");
    },
};
