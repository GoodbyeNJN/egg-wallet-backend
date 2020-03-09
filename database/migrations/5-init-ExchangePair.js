module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
            Add altering commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        const { INTEGER, FLOAT, BOOLEAN } = Sequelize;

        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                "ExchangePair",
                {
                    id: { type: INTEGER, comment: "序号", autoIncrement: true, primaryKey: true },
                    sourceCoinId: {
                        type: INTEGER,
                        references: {
                            model: "Coin",
                            key: "id",
                        },
                        comment: "来源币种序号",
                    },
                    targetCoinId: {
                        type: INTEGER,
                        references: {
                            model: "Coin",
                            key: "id",
                        },
                        comment: "目标币种序号",
                    },
                    rate: { type: FLOAT, comment: "兑换比率" },

                    hourAmount: { type: FLOAT, comment: "该小时兑换量（以来源币种为单位）" },
                    hourLimit: { type: FLOAT, comment: "每小时限额（以来源币种为单位）" },
                    dayAmount: { type: FLOAT, comment: "该日兑换量（以来源币种为单位）" },
                    dayLimit: { type: FLOAT, comment: "每日限额（以来源币种为单位）" },
                    deleted: { type: BOOLEAN, comment: "假删除", defaultValue: false },
                },
                {
                    charset: "utf8",
                    transaction,
                },
            );

            await queryInterface.addIndex("ExchangePair", ["sourceCoinId"], { transaction });
            await queryInterface.addIndex("ExchangePair", ["targetCoinId"], { transaction });

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
        return queryInterface.dropTable("ExchangePair");
    },
};
