module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
            Add altering commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        const { INTEGER, STRING, BOOLEAN } = Sequelize;

        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                "Wallet",
                {
                    id: { type: INTEGER, comment: "序号", autoIncrement: true, primaryKey: true },
                    base: { type: STRING, comment: "底层公链名" },
                    address: { type: STRING(42), comment: "钱包地址" },
                    private: { type: STRING(64), comment: "钱包私钥" },
                    deleted: { type: BOOLEAN, comment: "假删除", defaultValue: false },
                },
                {
                    charset: "utf8",
                    transaction,
                },
            );

            await queryInterface.addIndex("Wallet", ["address"], { transaction });

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
        return queryInterface.dropTable("Wallet");
    },
};
