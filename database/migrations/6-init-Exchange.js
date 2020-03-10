module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
            Add altering commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        const { INTEGER, FLOAT, STRING, BOOLEAN, UUID, UUIDV4, DATE } = Sequelize;

        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                "Exchange",
                {
                    id: {
                        type: UUID,
                        comment: "交易编号",
                        primaryKey: true,
                        defaultValue: UUIDV4,
                    },
                    exchangePairId: {
                        type: INTEGER,
                        references: {
                            model: "ExchangePair",
                            key: "id",
                        },
                        comment: "币种交易对的序号",
                    },
                    rate: { type: FLOAT, comment: "创建交易时的兑换比率" },
                    time: { type: DATE, comment: "创建交易时的时间" },

                    payStatus: {
                        type: STRING,
                        comment: "第一笔转账交易状态（success、fail、pending）",
                    },
                    payHash: { type: STRING(66), comment: "第一笔转账hash" },
                    payAddress: { type: STRING(42), comment: "第一笔转账的付款钱包地址" },
                    payAmount: { type: FLOAT, comment: "第一笔转账的金额（自然单位）" },
                    payTime: { type: DATE, comment: "第一笔转账的发起时间" },

                    receiveStatus: {
                        type: STRING,
                        comment: "第二笔转账交易状态（success、fail、pending）",
                    },
                    receiveHash: { type: STRING(66), comment: "第二笔转账hash" },
                    receiveAddress: { type: STRING(42), comment: "第二笔转账的收款钱包地址" },
                    receiveAmount: { type: FLOAT, comment: "第二笔转账的金额（自然单位）" },
                    receiveTime: { type: DATE, comment: "第二笔转账的发起时间" },

                    deleted: { type: BOOLEAN, comment: "假删除", defaultValue: false },
                },
                {
                    charset: "utf8",
                    transaction,
                },
            );

            await queryInterface.addIndex("Exchange", ["exchangePairId"], { transaction });
            await queryInterface.addIndex("Exchange", ["payHash"], { transaction });
            await queryInterface.addIndex("Exchange", ["payAddress"], { transaction });
            await queryInterface.addIndex("Exchange", ["receiveHash"], { transaction });
            await queryInterface.addIndex("Exchange", ["receiveAddress"], { transaction });

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
        return queryInterface.dropTable("Exchange");
    },
};
