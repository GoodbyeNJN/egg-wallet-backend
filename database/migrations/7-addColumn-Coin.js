module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
            Add altering commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        const { FLOAT } = Sequelize;

        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn(
                "Coin",
                "maxAmount",
                {
                    type: FLOAT,
                    comment: "单次转账的最大金额（自然单位）",
                    defaultValue: 0,
                },
                {
                    after: "walletId",
                    transaction,
                },
            );
            await queryInterface.addColumn(
                "Coin",
                "minAmount",
                {
                    type: FLOAT,
                    comment: "单次转账的最小金额（自然单位）",
                    defaultValue: 0,
                },
                {
                    after: "walletId",
                    transaction,
                },
            );

            transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        /*
            Add reverting commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.dropTable('users');
        */

        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.removeColumn("Coin", "minAmount", {
                transaction,
            });
            await queryInterface.removeColumn("Coin", "maxAmount", {
                transaction,
            });

            transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
